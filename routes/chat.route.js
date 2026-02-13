import express from "express"
import { getChatsByThread, sendChat } from "../controllers/chat.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"


const router = express.Router()

router.get("/:threadId", authMiddleware, getChatsByThread)
router.post("/", authMiddleware, sendChat)

export default router;