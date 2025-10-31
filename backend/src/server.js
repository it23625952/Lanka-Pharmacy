import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import { connectDB } from "./config/db.js";
import { JWT_SECRET } from "./config/jwt.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar] || process.env[envVar].includes('your_jwt_secret')) {
    console.error(`❌ FATAL: ${envVar} not configured properly`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());
app.use(rateLimiter);

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
