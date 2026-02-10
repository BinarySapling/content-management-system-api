import Like from "../models/like.js";
import Artifact from "../models/artifact.js";

export const toggleLikeService = async ({ artifactId, userId }) => {
  // Check if artifact exists
  const artifactExists = await Artifact.findById(artifactId);
  if (!artifactExists) {
    throw new Error("Artifact not found");
  }

  const existingLike = await Like.findOne({
    artifact: artifactId,
    user: userId,
  });

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
    return { liked: false };
  }

  await Like.create({
    artifact: artifactId,
    user: userId,
  });

  return { liked: true };
};

export const getLikesService = async (artifactId) => {
  const count = await Like.countDocuments({ artifact: artifactId });
  return { count };
};
