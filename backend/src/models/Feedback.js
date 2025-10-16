import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    customerID: { 
      type: String, 
      default: null 
    },
    rating: { 
      type: Number, 
      required: true,
      min: 1, 
      max: 5 
    },
    category: { 
      type: String, 
      required: true 
    },
    feedbackText: { 
      type: String, 
      required: true 
    },
    anonymous: { 
      type: Boolean, 
      default: false 
    },
    submittedAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
