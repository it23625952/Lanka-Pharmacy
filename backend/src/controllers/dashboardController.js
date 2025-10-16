// controllers/dashboardController.js
import Ticket from "../models/Ticket.js";
import Message from "../models/Message.js";
import Feedback from "../models/Feedback.js";
import CallbackRequest from "../models/CallbackRequest.js";

// Get overall dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Ticket statistics by status
    const ticketStats = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Total tickets count
    const totalTickets = await Ticket.countDocuments();

    // Recent tickets (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentTickets = await Ticket.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    // Priority distribution
    const priorityStats = await Ticket.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    // Average messages per ticket
    const avgMessages = await Message.aggregate([
      {
        $group: {
          _id: "$ticketID",
          messageCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          avgMessagesPerTicket: { $avg: "$messageCount" }
        }
      }
    ]);

    res.json({
      totalTickets,
      recentTickets,
      ticketsByStatus: ticketStats,
      ticketsByPriority: priorityStats,
      avgMessagesPerTicket: avgMessages[0]?.avgMessagesPerTicket || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get recent ticket activity
export const getRecentActivity = async (req, res) => {
  try {
    const recentTickets = await Ticket.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('ticketID subject status priority createdAt updatedAt');

    const recentMessages = await Message.find()
      .sort({ timeStamp: -1 })
      .limit(10)
      .select('ticketID sendBy message timeStamp');

    res.json({
      recentTickets,
      recentMessages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get ticket performance metrics
export const getPerformanceMetrics = async (req, res) => {
  try {
    // Tickets resolved in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const resolvedTickets = await Ticket.aggregate([
      {
        $match: {
          status: "Resolved",
          updatedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Pending callbacks count
    const pendingCallbacks = await CallbackRequest.countDocuments({
      status: "Pending"
    });

    // Recent feedback ratings
    const feedbackStats = await Feedback.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      resolvedTicketsTimeline: resolvedTickets,
      pendingCallbacks,
      feedbackRatings: feedbackStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
