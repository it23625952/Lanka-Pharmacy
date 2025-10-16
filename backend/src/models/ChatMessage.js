import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    ticketID: {
      type: String,
      required: true,
      index: true // fast kuu
    },
    sendBy: {
      type: String,
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    senderRole: {
      type: String,
      enum: ['customer', 'agent'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timeStamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// efficient queries kuu
chatMessageSchema.index({ ticketID: 1, timeStamp: 1 });

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;
