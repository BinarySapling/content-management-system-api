import {
    addCommentService,
    getCommentsService
} from "../services/comment.service.js";

export const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const artifactId = req.params.id;
        const userId = req.user.id;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }

        const comment = await addCommentService({
            artifactId,
            userId,
            content
        });

        res.status(201).json({
            success: true,
            comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getComments = async (req, res) => {
    try {
        const artifactId = req.params.id;
        const comments = await getCommentsService(artifactId);

        res.status(200).json({
            success: true,
            comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
