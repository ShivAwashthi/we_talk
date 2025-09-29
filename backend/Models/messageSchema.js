import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true   // ✅ fixed typo (was rquired)
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true   // ✅ fixed typo (was rquired)
    },
    message: {
        type: String,
        required: true
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        default: null    // ✅ fixed (was default: [])
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;
