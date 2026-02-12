import chat from "../models/chat.js";
import Thread from "../models/thread.js";

/**
 * Retrieves all chat messages for a specific thread, sorted by creation date.
 * Populates sender information.
 * 
 * @param {string} threadId - The unique identifier of the thread.
 * @returns {Promise<Array>} List of chat messages.
 */
export const getChatsByThreadService = async (threadId) => {
    return await chat.find({ thread: threadId })
        .populate("sender", "name email")
        .sort({ createdAt: 1 }); // Sort by oldest first
}

/**
 * Finds an existing thread between two users or creates a new one.
 * Ensures that the thread specifically contains only these two participants.
 * 
 * @param {string} userId1 - ID of the first participant.
 * @param {string} userId2 - ID of the second participant.
 * @returns {Promise<Object>} The thread document.
 */
export const findOrCreateThreadService = async (userId1, userId2) => {
    const participants = [userId1, userId2].sort();

    // Find thread with EXACTLY these participants
    let thread = await Thread.findOne({
        participants: { $all: participants },
        $expr: { $eq: [{ $size: "$participants" }, 2] }
    });

    if (!thread) {
        // Create new thread logic
        thread = await Thread.create({
            participants
        });
    }
    return thread;
}

/**
 * Services a new chat message processing request.
 * 1. Ensures thread existence.
 * 2. Creates chat record.
 * 3. Updates thread metadata (last message).
 * 
 * @param {Object} params - { senderId, receiverId, message }
 * @returns {Promise<Object>} The newly created chat message.
 */
export const sendChatService = async ({
    senderId,
    receiverId,
    message
}) => {
    // 1. Ensure conversation thread exists
    const thread = await findOrCreateThreadService(senderId, receiverId);

    // 2. Create the message
    const newChat = await chat.create({
        thread: thread._id,
        sender: senderId,
        message
    });

    // 3. Populate sender details for immediate UI feedback
    await newChat.populate("sender", "name email");

    // 4. Update the thread's "Last Message" for inbox sorting/preview
    thread.lastMessage = message;
    thread.lastMessageAt = new Date();
    await thread.save();

    return newChat;
}