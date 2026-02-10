import {
  toggleLikeService,
  getLikesService,
} from "../services/like.service.js";

export const toggleLike = async (req, res) => {
  try {
    const result = await toggleLikeService({
      artifactId: req.params.id,
      userId: req.user._id, 
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLikes = async (req, res) => {
  try {
    const result = await getLikesService(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
