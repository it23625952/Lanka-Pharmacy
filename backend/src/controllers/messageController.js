import Message from "../models/Message.js";
import Ticket from "../models/Ticket.js";

// Add a message to a ticket
export const addMessage = async (req, res) => {
  console.log('📩 Message request received:', JSON.stringify(req.body, null, 2));
  
  try {
    const { ticketID } = req.params;
    const { sendBy, senderName, senderRole, message, messageType } = req.body;
    
    // Validation
    if (!sendBy || !senderName || !senderRole || !message) {
      const missing = [];
      if (!sendBy) missing.push('sendBy');
      if (!senderName) missing.push('senderName');
      if (!senderRole) missing.push('senderRole');
      if (!message) missing.push('message');
      
      return res.status(400).json({ 
        message: `Missing required fields: ${missing.join(', ')}` 
      });
    }

    // Verify ticket exists
    const ticket = await Ticket.findOne({ ticketID });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const newMessage = new Message({
      ticketID,
      sendBy,
      senderName,
      senderRole,
      message,
      messageType: messageType || 'reply',
      ...req.body
    });

    const savedMessage = await newMessage.save();
    
    // Update ticket's updatedAt timestamp
    await Ticket.findOneAndUpdate(
      { ticketID },
      { updatedAt: Date.now() }
    );

    console.log('✅ Message added to ticket:', ticketID);
    res.status(201).json({
      message: 'Message added successfully',
      data: savedMessage
    });
  } catch (error) {
    console.error('❌ Error adding message:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all messages for a ticket
export const getMessagesByTicketID = async (req, res) => {
  try {
    const { ticketID } = req.params;

    // Verify ticket exists
    const ticket = await Ticket.findOne({ ticketID });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const messages = await Message.find({ ticketID })
      .sort({ timeStamp: 1 })
      .limit(100);

    console.log(`✅ Retrieved ${messages.length} messages for ticket: ${ticketID}`);
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
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update a message
export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: Date.now() };

    const message = await Message.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    console.log('✅ Message updated:', id);
    res.json({
      message: 'Message updated successfully',
      data: message
    });
  } catch (error) {
    console.error('❌ Error updating message:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    console.log('✅ Message deleted:', id);
    res.json({ 
      message: "Message deleted successfully",
      messageID: message._id
    });
  } catch (error) {
    console.error('❌ Error deleting message:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { ticketID } = req.params;
    
    const result = await Message.updateMany(
      { ticketID, isRead: false },
      { isRead: true }
    );
    
    console.log(`✅ Marked ${result.modifiedCount} messages as read for ticket: ${ticketID}`);
    res.json({ 
      message: 'Messages marked as read',
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('❌ Error marking messages as read:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get unread message count for a ticket
export const getUnreadCount = async (req, res) => {
  try {
    const { ticketID } = req.params;
    
    const count = await Message.countDocuments({ ticketID, isRead: false });
    
    console.log(`✅ Unread messages for ticket ${ticketID}: ${count}`);
    res.json({ ticketID, unreadCount: count });
  } catch (error) {
    console.error('❌ Error getting unread count:', error);
    res.status(500).json({ error: error.message });
  }
};
