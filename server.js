import "dotenv/config.js";
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import "./config/cloudinary.js";
import { archiveOldDrafts } from "./cron/archiveArtifacts.js";
import { registerSocketHandlers } from "./sockets/socket.js";

const PORT = process.env.PORT || 3000;

connectDB();

// Initialize Cron Jobs
archiveOldDrafts();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this in production
    methods: ["GET", "POST"],
    credentials:true
  }
});

registerSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
