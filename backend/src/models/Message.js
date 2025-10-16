import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    ticketID: {
      type: String,
      required: true,
      index: true
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
      enum: ['customer', 'agent', 'system'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    messageType: {
      type: String,
      enum: ['reply', 'update', 'note', 'system'],
      default: 'reply'
    },
    timeStamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    },
    applyBy: {
      type: String,
      default: null
    },
    isEdited: {
      type: Boolean,
      default: false
    },
    editedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Index for efficient queries
messageSchema.index({ ticketID: 1, timeStamp: 1 });
messageSchema.index({ ticketID: 1, isRead: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
