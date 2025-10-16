import Ticket from "../models/Ticket.js";

export const createTicket = async (req, res) => {
  console.log('📩 Ticket request received:', JSON.stringify(req.body, null, 2));
  
  try {
    const { customerID, subject, category, description, priority } = req.body;
    
    // Simple validation
    if (!customerID || !subject || !category || !description) {
      const missing = [];
      if (!customerID) missing.push('customerID');
      if (!subject) missing.push('subject');
      if (!category) missing.push('category');
      if (!description) missing.push('description');
      
      return res.status(400).json({ 
        message: `Missing required fields: ${missing.join(', ')}` 
      });
    }
    
    // Create ticket with openBy auto-filled
    const ticketData = {
      customerID,
      subject,
      category,
      description,
      priority: priority || 'Medium',
      openBy: customerID
    };
    
    const ticket = new Ticket(ticketData);
    const savedTicket = await ticket.save();  // ✅ Use savedTicket instead
    
    console.log('✅ Ticket created successfully:', savedTicket.ticketID);
    res.status(201).json({
      message: 'Ticket created successfully',
      ticket: savedTicket  // ✅ Return savedTicket which has the ticketID
    });
  } catch (error) {
    console.error('❌ Ticket creation error:', error);
    res.status(500).json({ 
      error: error.message
    });
  }
};



// Get all tickets with filters
export const getTickets = async (req, res) => {
  try {
    const filters = {};
    
    // Filter by customer ID
    if (req.query.customerID) filters.customerID = req.query.customerID;
    
    // Filter by status
    if (req.query.status) filters.status = req.query.status;
    
    // Filter by assigned agent
    if (req.query.assignedTo) filters.assignedTo = req.query.assignedTo;
    
    // Filter by priority
    if (req.query.priority) filters.priority = req.query.priority;
    
    // Filter by category
    if (req.query.category) filters.category = req.query.category;

    const tickets = await Ticket.find(filters).sort({ createdAt: -1 });
    
    console.log(`✅ Retrieved ${tickets.length} tickets`);
    res.json(tickets);
  } catch (error) {
    console.error('❌ Error fetching tickets:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    res.json(ticket);
  } catch (error) {
    console.error('❌ Error fetching ticket:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update ticket
export const updateTicket = async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: Date.now() };
    
    // If status is being changed to Resolved or Closed, set resolvedAt
    if ((req.body.status === 'Resolved' || req.body.status === 'Closed') && !req.body.resolvedAt) {
      updateData.resolvedAt = Date.now();
    }
    
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    console.log('✅ Ticket updated:', ticket.ticketID);
    res.json({
      message: 'Ticket updated successfully',
      ticket
    });
  } catch (error) {
    console.error('❌ Error updating ticket:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    console.log('✅ Ticket deleted:', ticket.ticketID);
    res.json({ 
      message: "Ticket deleted successfully",
      ticketID: ticket.ticketID 
    });
  } catch (error) {
    console.error('❌ Error deleting ticket:', error);
    res.status(500).json({ error: error.message });
  }
};

// Assign ticket to agent
export const assignTicket = async (req, res) => {
  try {
    const { agentID } = req.body;
    
    if (!agentID) {
      return res.status(400).json({ message: 'Agent ID is required' });
    }
    
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo: agentID,
        status: 'In Progress',
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    console.log('✅ Ticket assigned to agent:', agentID);
    res.json({
      message: 'Ticket assigned successfully',
      ticket
    });
  } catch (error) {
    console.error(' Error assigning ticket:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const updateData = {
      status,
      updatedAt: Date.now()
    };
    
    // Set resolvedAt when ticket is resolved or closed
    if (status === 'Resolved' || status === 'Closed') {
      updateData.resolvedAt = Date.now();
    }
    
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    console.log('✅ Ticket status updated to:', status);
    res.json({
      message: 'Ticket status updated successfully',
      ticket
    });
  } catch (error) {
    console.error('❌ Error updating ticket status:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get tickets by customer
export const getCustomerTickets = async (req, res) => {
  try {
    const { customerID } = req.params;
    
    const tickets = await Ticket.find({ customerID }).sort({ createdAt: -1 });
    
    console.log(`✅ Retrieved ${tickets.length} tickets for customer:`, customerID);
    res.json(tickets);
  } catch (error) {
    console.error('❌ Error fetching customer tickets:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get ticket statistics (for dashboard)
export const getTicketStats = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'Open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'In Progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
    const closedTickets = await Ticket.countDocuments({ status: 'Closed' });
    
    res.json({
      total: totalTickets,
      open: openTickets,
      inProgress: inProgressTickets,
      resolved: resolvedTickets,
      closed: closedTickets
    });
  } catch (error) {
    console.error('❌ Error fetching ticket stats:', error);
    res.status(500).json({ error: error.message });
  }
};
