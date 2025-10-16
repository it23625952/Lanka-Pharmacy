import mongoose from "mongoose";

const callbackRequestSchema = new mongoose.Schema(
  {
    callbackID: {
      type: String,
      unique: true
    },
    userId: {
      type: String,
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    preferredTime: {
      type: String,
      required: true,
      enum: ['Morning (9AM-12PM)', 'Afternoon (12PM-3PM)', 'Evening (3PM-6PM)', 'Night (6PM-9PM)']
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Scheduled", "Completed", "Cancelled"],
      default: "Pending"
    },
    assignedStaffId: {
      type: String,
      default: null
    },
    notes: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Generate unique callback ID before saving
callbackRequestSchema.pre('save', async function(next) {
  if (!this.callbackID) {
    try {
      const count = await this.constructor.countDocuments();
      this.callbackID = `CB${String(count + 1).padStart(6, '0')}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const CallbackRequest = mongoose.model("CallbackRequest", callbackRequestSchema);
export default CallbackRequest;
