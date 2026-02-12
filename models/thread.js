import mongoose from "mongoose";

/**
 * Thread Schema
 * Represents a conversation between two participants.
 * Used to group chat messages and show inbox previews.
 */
const threadSchema = new mongoose.Schema(
  {
    // List of users in this conversation (e.g., [UserA, UserB])
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    // Snapshot of the last message for inbox preview (performance optimization)
    lastMessage: {
      type: String,
      default: ""
    },
    // Timestamp of the last message for sorting
    lastMessageAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Thread", threadSchema);