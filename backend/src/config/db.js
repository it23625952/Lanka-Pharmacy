import mongoose from "mongoose";

/**
 * Establishes a connection to MongoDB using the connection string from environment variables.
 * Handles connection events and provides appropriate logging for success or failure scenarios.
 * 
 * @throws {Error} If the connection fails, logs the error and terminates the process
 * @returns {Promise<void>} Resolves when connection is established successfully
 */
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1); // Terminate application on database connection failure
    }
};