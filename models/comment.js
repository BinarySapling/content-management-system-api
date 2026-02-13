import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    artifact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artifact",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
