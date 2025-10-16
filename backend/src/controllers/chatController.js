import ChatMessage from "../models/ChatMessage.js";
import Ticket from "../models/Ticket.js";

// Get chat messages for a ticket
export const getChatMessages = async (req, res) => {
  try {
    const { ticketID } = req.params;
    const messages = await ChatMessage.find({ ticketID })
      .sort({ timeStamp: 1 })
      .limit(100);

    console.log(`✅ Retrieved ${messages.length} messages for ticket: ${ticketID}`);
    res.json(messages);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get chat history (with ticket info)
export const getChatHistory = async (req, res) => {
  try {
    const { ticketID } = req.params;
    
    const ticket = await Ticket.findOne({ ticketID });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const messages = await ChatMessage.find({ ticketID })
      .sort({ timeStamp: 1 })
      .limit(100);

    res.json({
      ticket: {
        ticketID: ticket.ticketID,
        subject: ticket.subject,
        status: ticket.status,
        category: ticket.category
      },
      messages
    });
  } catch (error) {
    console.error('❌ Error fetching chat history:', error);
    res.status(500).json({ error: error.message });
  }
};

// Send a chat message
export const sendChatMessage = async (req, res) => {
  try {
    const { ticketID, sendBy, senderName, senderRole, message } = req.body;
    
    if (!ticketID || !sendBy || !senderName || !senderRole || !message) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    const ticket = await Ticket.findOne({ ticketID });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    const chatMessage = new ChatMessage({ 
      ticketID, 
      sendBy, 
      senderName,
      senderRole,
      message 
    });
    
    const savedMessage = await chatMessage.save();
    
    console.log('✅ Message sent:', savedMessage._id);
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { ticketID } = req.params;
    
    await ChatMessage.updateMany(
      { ticketID, isRead: false },
      { isRead: true }
    );
    
    console.log('✅ Messages marked as read for ticket:', ticketID);
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('❌ Error marking messages as read:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete chat message
export const deleteChatMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await ChatMessage.findByIdAndDelete(messageId);
    
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    
    console.log('✅ Message deleted:', messageId);
    res.json({ message: "Chat message deleted successfully" });
  } catch (error) {
    console.error('❌ Error deleting message:', error);
    res.status(500).json({ error: error.message });
  }
};
