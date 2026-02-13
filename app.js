import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import artifactRoutes from "./routes/artifacts.route.js";
import chatRoutes from "./routes/chat.route.js";
import webhookRoutes from "./webhook/webhook.js";

const app = express();

app.use(cors()); 
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" })); 
app.use(morgan("dev")); 
app.use(cookieParser()); 

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CMS Backend is running",
  });
});

app.use("/auth", authRoutes);
app.use("/artifacts", artifactRoutes);
app.use("/webhook", webhookRoutes);
app.use("/chat", chatRoutes);

export default app;
