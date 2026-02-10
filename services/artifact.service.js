import Artifact from "../models/artifact.js";

export const createArtifactService = async (data) => {
  const artifact = await Artifact.create(data);
  return artifact;
};

export const getAllArtifactsService = async () => {
  const artifacts = await Artifact.find().populate("author", "name email");
  return artifacts;
};
