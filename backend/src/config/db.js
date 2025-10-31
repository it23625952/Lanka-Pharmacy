// config/db.js
import mongoose from "mongoose";

/**
 * Connects to MongoDB using the URI from environment variables.
 * Logs success or failure and exits on error.
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
