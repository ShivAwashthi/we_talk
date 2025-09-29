import Conversation from "../Models/conversationModel.js";
import Message from "../Models/messageSchema.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id; // ✅ user attached by isLogin middleware

    // Find existing conversation or create new
    let chat = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create new message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
      conversationId: chat._id,
    });

    // Push message ID into conversation
    if(newMessage){
    chat.messages.push(newMessage._id);
    }
     
    // SOCKET.IO function
   await Promise.all([chat.save(), newMessage.save()]);

    res.status(201).send(newMessage);
    
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};
