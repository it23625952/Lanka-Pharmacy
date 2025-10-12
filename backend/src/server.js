import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

// Route imports
import productRoutes from "./routes/productRoutes.js";

// Configuration imports
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

// Load environment variables
dotenv.config();

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

// Static file serving for uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API route registration
app.use("/api/products", productRoutes);

// Database connection and server startup
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});