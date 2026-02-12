import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Route Imports
import authRoutes from "./routes/auth.route.js";
import artifactRoutes from "./routes/artifacts.route.js";
import chatRoutes from "./routes/chat.route.js";
import webhookRoutes from "./webhook/webhook.js";

const app = express();

// ==========================================
// Middleware Configuration
// ==========================================
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded bodies
app.use(morgan("dev")); // HTTP Request Logger
app.use(cookieParser()); // Parse Cookie header

// ==========================================
// Route Configuration
// ==========================================

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CMS Backend is running",
  });
});

// API Routes
app.use("/auth", authRoutes);
app.use("/artifacts", artifactRoutes);
app.use("/webhook", webhookRoutes);
app.use("/chat", chatRoutes);

export default app;
