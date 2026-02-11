import {
  createArtifactService,
  getAllArtifactsService,
} from "../services/artifact.service.js";

export const createArtifact = async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const author = req.user.id;
    const media = req.file ? req.file.path : null;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const artifact = await createArtifactService({
      title,
      content,
      status,
      status,
      author,
      media,
    });

    res.status(201).json({
      success: true,
      message: "Artifact created successfully",
      artifact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllArtifacts = async (req, res) => {
  try {
    const artifacts = await getAllArtifactsService();
    res.status(200).json({
      success: true,
      artifacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
