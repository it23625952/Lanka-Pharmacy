// controllers/staffDashboardController.js
import Ticket from "../models/Ticket.js";
import Message from "../models/Message.js";
import Feedback from "../models/Feedback.js";
import CallbackRequest from "../models/CallbackRequest.js";

// Get customer engagement overview
export const getCustomerEngagement = async (req, res) => {
  try {
    // Total unique customers
    const totalCustomers = await Ticket.distinct("customerID").then(customers => customers.length);

    // Customer interaction frequency
    const customerInteractions = await Ticket.aggregate([
      {
        $group: {
          _id: "$customerID",
          totalTickets: { $sum: 1 },
          lastInteraction: { $max: "$updatedAt" }
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $gte: ["$totalTickets", 5] }, "High Activity",
              { $cond: [{ $gte: ["$totalTickets", 2] }, "Medium Activity", "Low Activity"] }
            ]
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Active customers (interacted in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeCustomers = await Ticket.distinct("customerID", {
      updatedAt: { $gte: thirtyDaysAgo }
    }).then(customers => customers.length);

    res.json({
      totalCustomers,
      activeCustomers,
      customerInteractionLevels: customerInteractions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get customer satisfaction metrics
export const getCustomerSatisfaction = async (req, res) => {
  try {
    // Feedback rating distribution
    const feedbackDistribution = await Feedback.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Average satisfaction score
    const avgSatisfaction = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalFeedbacks: { $sum: 1 }
        }
      }
    ]);

    // Customer feedback trends (last 3 months)
    const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const feedbackTrends = await Feedback.aggregate([
      {
        $match: { createdAt: { $gte: threeMonthsAgo } }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          avgRating: { $avg: "$rating" },
          feedbackCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({
      feedbackDistribution,
      overallSatisfaction: avgSatisfaction[0] || { averageRating: 0, totalFeedbacks: 0 },
      satisfactionTrends: feedbackTrends
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get customer interaction patterns
export const getInteractionPatterns = async (req, res) => {
  try {
    // Top customers by ticket volume
    const topCustomers = await Ticket.aggregate([
      {
        $group: {
          _id: "$customerID",
          ticketCount: { $sum: 1 },
          lastTicket: { $max: "$createdAt" },
          ticketPriorities: { $push: "$priority" }
        }
      },
      { $sort: { ticketCount: -1 } },
      { $limit: 10 }
    ]);

    // Issue category patterns
    const issuePatterns = await Ticket.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgResolutionTime: { 
            $avg: { 
              $subtract: ["$updatedAt", "$createdAt"] 
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Message volume per customer
    const messageVolume = await Message.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "ticketID",
          foreignField: "ticketID",
          as: "ticket"
        }
      },
      { $unwind: "$ticket" },
      {
        $group: {
          _id: "$ticket.customerID",
          totalMessages: { $sum: 1 },
          avgMessagesPerTicket: { 
            $avg: { $sum: 1 } 
          }
        }
      },
      { $sort: { totalMessages: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      topCustomersByVolume: topCustomers,
      issuePatterns,
      customerMessageVolume: messageVolume
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get callback and follow-up metrics
export const getCallbackMetrics = async (req, res) => {
  try {
    // Callback request patterns
    const callbackPatterns = await CallbackRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Customer callback frequency
    const callbackFrequency = await CallbackRequest.aggregate([
      {
        $group: {
          _id: "$customerID",
          callbackCount: { $sum: 1 },
          lastCallback: { $max: "$requestedTime" }
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $gte: ["$callbackCount", 3] }, "Frequent",
              { $cond: [{ $eq: ["$callbackCount", 2] }, "Occasional", "One-time"] }
            ]
          },
          customerCount: { $sum: 1 }
        }
      }
    ]);

    // Pending callback urgency
    const pendingCallbacks = await CallbackRequest.aggregate([
      {
        $match: { status: "Pending" }
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      callbackStatusDistribution: callbackPatterns,
      customerCallbackFrequency: callbackFrequency,
      pendingCallbacksByPriority: pendingCallbacks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get detailed customer profile
export const getCustomerProfile = async (req, res) => {
  try {
    const { customerID } = req.params;

    // Customer ticket history
    const customerTickets = await Ticket.find({ customerID })
      .sort({ createdAt: -1 })
      .limit(20);

    // Customer feedback history
    const customerFeedback = await Feedback.find({ customerID })
      .sort({ createdAt: -1 })
      .limit(10);

    // Customer callback history
    const customerCallbacks = await CallbackRequest.find({ customerID })
      .sort({ requestedTime: -1 })
      .limit(10);

    // Customer interaction summary
    const interactionSummary = await Ticket.aggregate([
      { $match: { customerID } },
      {
        $group: {
          _id: null,
          totalTickets: { $sum: 1 },
          resolvedTickets: { 
            $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] }
          },
          avgPriority: { $avg: "$priority" },
          firstInteraction: { $min: "$createdAt" },
          lastInteraction: { $max: "$updatedAt" }
        }
      }
    ]);

    res.json({
      customerTickets,
      customerFeedback,
      customerCallbacks,
      interactionSummary: interactionSummary[0] || {}
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
