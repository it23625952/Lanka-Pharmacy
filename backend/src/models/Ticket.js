import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketID: {
      type: String,
      unique: true
    },
    customerID: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Prescription Issues',
        'Order Status & Tracking',
        'Delivery Problems',
        'Payment & Billing',
        'Product Information',
        'Account Issues',
        'Insurance Claims',
        'Medication Questions',
        'Return & Refund',
        'Other'
      ]
    },
    description: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    assignedTo: {
      type: String,
      default: null
    },
    openBy: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Generate unique ticket ID before saving
ticketSchema.pre('save', async function(next) {
  if (!this.ticketID) {
    try {
      const count = await this.constructor.countDocuments();
      this.ticketID = `TKT${String(count + 1).padStart(6, '0')}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
