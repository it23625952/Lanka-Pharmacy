import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from "./routes/cartRoutes.js";
import staffRoutes from './routes/staffRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import salaryRoutes from './routes/salaryRoutes.js';

// Configuration imports
import { connectDB } from "./config/db.js";
import { JWT_SECRET } from "./config/jwt.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar] || process.env[envVar].includes('your_jwt_secret')) {
    console.error(`❌ FATAL: ${envVar} not configured properly`);
    process.exit(1); // Terminate application on missing or default configuration
  }
});

const app = express();
const PORT = process.env.PORT || 5001; // Default to port 5001 if not specified

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json()); // Parse JSON request bodies
app.use(rateLimiter); // Apply rate limiting to all routes

// Static file serving for uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API route registration
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/cart", cartRoutes);

// Start server after DB connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
});
