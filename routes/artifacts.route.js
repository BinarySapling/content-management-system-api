import express from "express";
import {
  createArtifact,
  getAllArtifacts,
} from "../controllers/artifact.controller.js";
import { toggleLike, getLikes } from "../controllers/likes.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { upload } from "../middleware/uploads.middleware.js";
import apilimiter from "../middleware/ratelimiter.middleware.js";
const router = express.Router();

// Apply auth middleware to protect these routes
// Only ADMIN and EDITOR can create artifacts
router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "EDITOR"),
  upload.single("file"),
  createArtifact,
);
router.get("/",apilimiter, authMiddleware, getAllArtifacts);

// Like routes
router.post("/:id/like", authMiddleware, toggleLike);
router.get("/:id/likes", getLikes);

export default router;
