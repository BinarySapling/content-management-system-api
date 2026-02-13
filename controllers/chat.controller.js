import { getChatsByThreadService, sendChatService } from './../services/chat.service.js';

export const getChatsByThread = async (req, res) => {
    try {
        const { threadId } = req.params;

        const chats = await getChatsByThreadService(threadId);

        res.status(200).json({
            success: true,
            chats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const sendChat = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id; 

        if (!receiverId || !message) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID and message are required"
            });
        }

        const newChat = await sendChatService({
            senderId,
            receiverId,
            message
        });
        
        res.status(201).json({
            success: true,
            chat: newChat
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}