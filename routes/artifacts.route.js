import express from "express";
import {
  createArtifact,
  getAllArtifacts,
} from "../controllers/artifact.controller.js";
import { toggleLike, getLikes } from "../controllers/likes.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to protect these routes
router.post("/", authMiddleware, createArtifact);
router.get("/", authMiddleware, getAllArtifacts);

// Like routes
router.post("/:id/like", authMiddleware, toggleLike);
router.get("/:id/likes", getLikes);

export default router;
