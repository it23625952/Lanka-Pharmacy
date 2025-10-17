import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

// Route imports
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import orderRoutes from './routes/orderRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import salaryRoutes from './routes/salaryRoutes.js';

// Config imports
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar] || process.env[envVar].includes('your_jwt_secret')) {
    console.error(`❌ FATAL: ${envVar} not configured properly`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // fixed
    credentials: true
}));
app.use(express.json());
app.use(rateLimiter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/salary", salaryRoutes);

// Start server after DB connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
});
