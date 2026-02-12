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
    }
  }

  const artifact = await Artifact.create(data);
  return artifact;
};

export const getAllArtifactsService = async () => {
  const artifacts = await Artifact.find().populate("author", "name email");
  return artifacts;
};

