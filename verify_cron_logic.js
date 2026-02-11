import mongoose from "mongoose";
import Artifact from "./models/artifact.js";
import { checkAndArchive } from "./cron/archiveArtifacts.js";
import fs from "fs";
import path from "path";

// Load env manullay
if (fs.existsSync(".env")) {
    const envConfig = fs.readFileSync(".env", "utf-8");
    envConfig.split(/\r?\n/).forEach((line) => {
        const parts = line.split("=");
        const key = parts.shift();
        let value = parts.join("=");
        if (key && value) {
            value = value.trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            process.env[key.trim()] = value;
        }
    });
}
console.log("MONGO_URI Length:", process.env.MONGO_URI ? process.env.MONGO_URI.length : "undefined");

const verifyCron = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Create test artifacts
        const oldDraft = await Artifact.create({
            title: "Old Draft",
            content: "Content",
            status: "DRAFT",
            author: new mongoose.Types.ObjectId(), // Fake ID
            updatedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000) // 31 days ago
        });

        const newDraft = await Artifact.create({
            title: "New Draft",
            content: "Content",
            status: "DRAFT",
            author: new mongoose.Types.ObjectId(),
            updatedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000) // 29 days ago
        });

        console.log("Created test artifacts:", { oldDraft: oldDraft._id, newDraft: newDraft._id });

        // Run the cron logic
        await checkAndArchive();

        // Verify results
        const oldDraftCheck = await Artifact.findById(oldDraft._id);
        const newDraftCheck = await Artifact.findById(newDraft._id);

        console.log("Old Draft Status:", oldDraftCheck.status); // Should be ARCHIVED
        console.log("New Draft Status:", newDraftCheck.status); // Should be DRAFT

        // Cleanup
        await Artifact.findByIdAndDelete(oldDraft._id);
        await Artifact.findByIdAndDelete(newDraft._id);
        console.log("Cleanup complete");

        mongoose.disconnect();

    } catch (error) {
        console.error("Verification failed:", error);
        if (mongoose.connection.readyState === 1) {
            mongoose.disconnect();
        }
    }
};

verifyCron();
