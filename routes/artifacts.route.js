import express from "express";
import {
  createArtifact,
  getAllArtifacts,
} from "../controllers/artifact.controller.js";
import { toggleLike, getLikes } from "../controllers/likes.controller.js";
import { addComment, getComments } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/uploads.middleware.js";
import apilimiter from "../middlewares/ratelimiter.middleware.js";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "EDITOR"),
  upload.single("file"),
  createArtifact,
);
router.get("/", apilimiter, authMiddleware, getAllArtifacts);

router.post("/:id/like", authMiddleware, toggleLike);
router.get("/:id/likes", getLikes);

router.post("/:id/comments", authMiddleware, addComment);
router.get("/:id/comments", getComments);

export default router;
