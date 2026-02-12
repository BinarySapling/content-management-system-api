import { getChatsByThreadService, sendChatService } from './../services/chat.service.js';

/**
 * Controller: Get Chats by Thread ID
 * Fetches the conversation history for a specific thread.
 * 
 * @route GET /chat/:threadId
 * @access Private
 */
export const getChatsByThread = async (req, res) => {
    try {
        const { threadId } = req.params;

        // Call Service
        const chats = await getChatsByThreadService(threadId);

        // Success Response
        res.status(200).json({
            success: true,
            chats
        });
    } catch (error) {
        // Error Handler
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Controller: Send a New Chat Message
 * Handles creating a message and ensuring the thread exists.
 * 
 * @route POST /chat
 * @access Private (Requires Auth Middleware)
 */
export const sendChat = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        // User ID comes from the Auth Middleware (req.user)
        const senderId = req.user.id; 

        // Input Validation
        if (!receiverId || !message) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID and message are required"
            });
        }

        // Call Service
        const newChat = await sendChatService({
            senderId,
            receiverId,
            message
        });
        
        // Success Response (201 Created)
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