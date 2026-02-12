import "dotenv/config.js";
import dotenv from "dotenv";
dotenv.config();

// Core Modules
import http from "http";
import { Server } from "socket.io";

// App & Config
import app from "./app.js";
import connectDB from "./config/db.js";
import "./config/cloudinary.js";

// Jobs & Sockets
import { archiveOldDrafts } from "./cron/archiveArtifacts.js";
import { registerSocketHandlers } from "./sockets/socket.js";

const PORT = process.env.PORT || 3000;

// 1. Connect to Database
connectDB();

// 2. Initialize Cron Jobs
archiveOldDrafts();

// 3. Create HTTP Server for Socket.io support
const server = http.createServer(app);

// 4. Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development; restrict in production
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 5. Register Socket Event Handlers
registerSocketHandlers(io);

// 6. Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
