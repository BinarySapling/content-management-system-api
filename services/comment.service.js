import Comment from "../models/comment.js";

export const addCommentService = async ({ artifactId, userId, content }) => {
  const comment = await Comment.create({
    artifact: artifactId,
    user: userId,
    content
  });
  await comment.populate("user", "name email");
  return comment;
};

export const getCommentsService = async (artifactId) => {
  const comments = await Comment.find({ artifact: artifactId })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  return comments;
};
