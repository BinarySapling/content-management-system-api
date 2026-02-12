import { sendChatService } from "../services/chat.service.js";

/**
 * Initializes Socket.IO event handlers.
 * Manages real-time connections, user online status, and messaging.
 * 
 * @param {Object} io - The Socket.IO server instance.
 */
export const registerSocketHandlers = (io) => {
    // Map to store active user connections: { userId: socketId }
    const onlineUser = new Map();

    io.on("connection", (socket) => {
        console.log("New Client Connected", socket.id);

        /**
         * Event: user-online
         * Triggered when a user logs in or connects.
         * Maps their database User ID to their current Socket ID.
         */
        socket.on("user-online", (userId) => {
            onlineUser.set(userId, socket.id);
            // Store userId on the socket object for easy cleanup on disconnect
            socket.userId = userId; 
            console.log("Online Users", Array.from(onlineUser.entries()));
        });

        /**
         * Event: send-message
         * Handles incoming chat messages from a client.
         * Persists message to DB and emits to receiver if online.
         */
        socket.on("send-message", async (data) => {
            try {
                const { senderId, receiverId, message } = data;

                // 1. Save to Database (using existing service logic)
                const chat = await sendChatService({
                    senderId,
                    receiverId,
                    message
                });

                // 2. Check if receiver is online
                const receiverSocketId = onlineUser.get(receiverId);

                // 3. Emit to receiver's specific socket
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive-message", chat);
                }
            } catch (error) {
                console.error("Socket Error:", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        /**
         * Event: disconnect
         * Cleans up the user mapping when connection is lost.
         */
        socket.on("disconnect", () => {
            console.log("Client Disconnected", socket.id);
            if (socket.userId) {
                onlineUser.delete(socket.userId);
                console.log("User removed from online list:", socket.userId);
            }
        });
    });
}