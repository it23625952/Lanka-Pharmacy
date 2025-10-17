import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import orderRoutes from './routes/orderRoutes.js';
import { connectDB } from "./config/db.js";
import { JWT_SECRET } from "./config/jwt.js"; // Import JWT configuration
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

// Validate required environment variables for production security
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar] || process.env[envVar].includes('your_jwt_secret')) {
    console.error(`❌ FATAL: ${envVar} not configured properly`);
    process.exit(1); // Terminate application on missing or default configuration
  }
});

const app = express();
const PORT = process.env.PORT || 5001; // Default to port 5001 if not specified

// Middleware configuration
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from frontend development server
}));
app.use(express.json()); // Parse JSON request bodies
app.use(rateLimiter); // Apply rate limiting to all routes

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API route handlers
app.use("/api/products", productRoutes); // Product-related endpoints
app.use("/api/users", userRoutes); // User authentication and profile endpoints
app.use("/api/prescriptions", prescriptionRoutes)
app.use("/api/orders", orderRoutes);

// Database connection and server startup
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});