import mongoose from "mongoose";
import Artifact from "./models/artifact.js";
import { checkAndArchive } from "./cron/archiveArtifacts.js";
import fs from "fs";
import path from "path";


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

        const oldDraft = await Artifact.create({
            title: "Old Draft",
            content: "Content",
            status: "DRAFT",
            author: new mongoose.Types.ObjectId(),
        });
        oldDraft.updatedAt = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
        await oldDraft.save({ timestamps: false });

        const newDraft = await Artifact.create({
            title: "New Draft",
            content: "Content",
            status: "DRAFT",
            author: new mongoose.Types.ObjectId(),
        });
        newDraft.updatedAt = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000);
        await newDraft.save({ timestamps: false });

        console.log("Created test artifacts:", { oldDraft: oldDraft._id, newDraft: newDraft._id });
        console.log("Old Draft UpdateAt:", oldDraft.updatedAt);
        console.log("New Draft UpdateAt:", newDraft.updatedAt);

        await checkAndArchive();

        const oldDraftCheck = await Artifact.findById(oldDraft._id);
        const newDraftCheck = await Artifact.findById(newDraft._id);

        let success = true;
        if (oldDraftCheck.status !== "ARCHIVED") {
            console.error("FAILURE: Old draft was not archived. Status:", oldDraftCheck.status);
            success = false;
        }
        if (newDraftCheck.status !== "DRAFT") {
            console.error("FAILURE: New draft was archived. Status:", newDraftCheck.status);
            success = false;
        }

        if (success) {
            console.log("VERIFICATION SUCCESS");
        } else {
            console.log("VERIFICATION FAILURE");
        }

        await Artifact.findByIdAndDelete(oldDraft._id);
        
        mongoose.disconnect();

    } catch (error) {
        console.error("Verification failed:", error);
        if (mongoose.connection.readyState === 1) {
            mongoose.disconnect();
        }
    }
};

verifyCron();
