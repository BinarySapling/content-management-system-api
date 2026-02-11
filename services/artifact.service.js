import Artifact from "../models/artifact.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const createArtifactService = async (data) => {
  let mediaUrl = null;
  if (data.media) {
    try {
      console.log("Attempting Cloudinary upload for:", data.media);
      const uploadResult = await cloudinary.uploader.upload(data.media, {
        folder: "csm-artifacts",
        resource_type: "auto"
      });
      console.log("Cloudinary upload success:", uploadResult.secure_url);
      mediaUrl = uploadResult.secure_url;
      fs.unlinkSync(data.media);
      data.media = mediaUrl;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      // Fallback: keep local path or throw error? For now, let's keep local path but log error
      // data.media remains properly set to local path which is fine to save if upload fails
    }
  }

  const artifact = await Artifact.create(data);
  return artifact;
};

export const getAllArtifactsService = async () => {
  const artifacts = await Artifact.find().populate("author", "name email");
  return artifacts;
};

