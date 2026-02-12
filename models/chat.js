import mongoose from "mongoose";

/**
 * Chat Message Schema
 * Represents a single message within a conversation thread.
 */
const chatSchema = new mongoose.Schema(
  {
    // The conversation this message belongs to
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      required: true
    },
    // The user who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // The message content
    message: {
      type: String,
      required: true,
      trim: true
    },
    // Read status (feature for future implementation)
    isRead: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);