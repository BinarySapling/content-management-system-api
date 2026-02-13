import "dotenv/config.js";
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./config/db.js";
import "./config/cloudinary.js";

import { archiveOldDrafts } from "./cron/archiveArtifacts.js";
import { registerSocketHandlers } from "./sockets/socket.js";

const PORT = process.env.PORT || 3000;

connectDB();

archiveOldDrafts();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
    credentials: true
  }
});

registerSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
