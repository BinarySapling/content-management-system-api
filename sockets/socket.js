import { sendChatService } from "../services/chat.service.js";

export const registerSocketHandlers = (io) => {
    const onlineUser = new Map();

    io.on("connection", (socket) => {
        console.log("New Client Connected", socket.id);

        socket.on("user-online", (userId) => {
            onlineUser.set(userId, socket.id);
            socket.userId = userId; 
            console.log("Online Users", Array.from(onlineUser.entries()));
        });

        socket.on("send-message", async (data) => {
            try {
                const { senderId, receiverId, message } = data;

                const chat = await sendChatService({
                    senderId,
                    receiverId,
                    message
                });

                const receiverSocketId = onlineUser.get(receiverId);

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive-message", chat);
                }
            } catch (error) {
                console.error("Socket Error:", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        socket.on("disconnect", () => {
            console.log("Client Disconnected", socket.id);
            if (socket.userId) {
                onlineUser.delete(socket.userId);
                console.log("User removed from online list:", socket.userId);
            }
        });
    });
}