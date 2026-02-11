import cron from "node-cron";
import Artifact from "../models/artifact.js";

export const checkAndArchive = async () => {
    console.log("Running archiveOldDrafts cron job...");
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const result = await Artifact.updateMany(
            {
                status: "DRAFT",
                updatedAt: { $lt: thirtyDaysAgo },
            },
            {
                $set: { status: "ARCHIVED" },
            }
        );

        console.log(
            `Archive job completed. ${result.modifiedCount} artifacts archived.`
        );
    } catch (error) {
        console.error("Error running archiveOldDrafts cron job:", error);
    }
};

export const archiveOldDrafts = () => {
    // Schedule task to run every 12 hours
    cron.schedule("0 */12 * * *", checkAndArchive);
};
