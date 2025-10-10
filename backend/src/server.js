import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

// Route imports
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import orderRoutes from './routes/orderRoutes.js';

// Configuration imports
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate required environment variables for production security
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar] || process.env[envVar].includes('your_jwt_secret')) {
    console.error(`❌ FATAL: ${envVar} not configured properly`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware configuration
app.use(cors({
    origin: 'http://localhost:5173',
}));
app.use(express.json());
app.use(rateLimiter);

// Static file serving for uploaded files - use the correct path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API route registration
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/orders", orderRoutes);

// Database connection and server startup
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📁 Static files serving from: ${path.join(__dirname, 'uploads')}`);
        console.log(`🌐 API endpoints available at: http://localhost:${PORT}/api`);
    });
}).catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});