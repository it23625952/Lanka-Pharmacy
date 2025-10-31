// ============================================
// Lanka Pharmacy Management System - Backend
// MERGED server.js - Complete System
// ============================================

import express from "express";
import expressWs from "express-ws";
import path from "path";
import { createServer } from 'http';
import cors from "cors";
import dotenv from "dotenv";

// Route imports - YOUR SYSTEM (Help & Support with WebSocket)
import productRoutes from "./src/routes/productRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import prescriptionRoutes from "./src/routes/prescriptionRoutes.js";
import orderRoutes from './src/routes/orderRoutes.js';

// HELP & SUPPORT ROUTE IMPORTS (Your System)
import feedbackRoutes from './src/routes/feedbackRoutes.js';
import ticketRoutes from './src/routes/ticketRoutes.js';
import callbackRoutes from './src/routes/callbackRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import staffDashboardRoutes from './src/routes/staffDashboardRoutes.js';

// GROUP SYSTEM ROUTE IMPORTS (Staff, Cart, Reviews, Waste)
import cartRoutes from "./src/routes/cartRoutes.js";
import staffRoutes from './src/routes/staffRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';
import attendanceRoutes from './src/routes/attendanceRoutes.js';
import salaryRoutes from './src/routes/salaryRoutes.js';
import reviewRoutes from "./src/routes/reviewRoutes.js";
import wasteRoutes from "./src/routes/wasteRoutes.js";

// Model import (for WebSocket chat)
import ChatMessage from './src/models/ChatMessage.js';

// Configuration imports
import { connectDB } from "./src/config/db.js";
import { JWT_SECRET } from "./src/config/jwt.js";
import rateLimiter from "./src/middleware/rateLimiter.js";

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

// Create HTTP server for WebSocket support
const server = createServer(app);
const expressWsInstance = expressWs(app);

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from frontend development server
}));
app.use(express.json());
app.use(rateLimiter);

// Static file serving for uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ============================================
// API ROUTES - COMBINED SYSTEM
// ============================================

// Core Routes (Shared by both systems)
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/orders", orderRoutes);

// HELP & SUPPORT ROUTES (Your System)
app.use("/api/feedback", feedbackRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/callbacks", callbackRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/staff-dashboard", staffDashboardRoutes);

// STAFF MANAGEMENT ROUTES (Group System)
app.use("/api/staff", staffRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/salary", salaryRoutes);

// ADDITIONAL FEATURES (Group System)
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/waste", wasteRoutes);

// ============================================
// WEBSOCKET ROUTE FOR LIVE CHAT
// ============================================

app.ws('/chat/:ticketID', async (ws, req) => {
  const ticketID = req.params.ticketID;
  console.log(`✅ WebSocket connected for ticket: ${ticketID}`);

  // Send chat history to newly connected client
  try {
    const chatHistory = await ChatMessage.find({ ticketID })
      .sort({ timeStamp: 1 })
      .limit(50);

    ws.send(JSON.stringify({
      type: 'chat_history',
      messages: chatHistory
    }));
    
    console.log(`📜 Sent ${chatHistory.length} messages to client`);
  } catch (error) {
    console.error('❌ Error sending chat history:', error);
  }

  // Handle incoming messages
  ws.on('message', async (data) => {
    try {
      const messageData = JSON.parse(data);
      const { sendBy, senderName, senderRole, message, type = 'chat_message' } = messageData;

      if (type === 'chat_message') {
        const chatMessage = new ChatMessage({
          ticketID,
          sendBy,
          senderName: senderName || 'Unknown',
          senderRole: senderRole || 'customer',
          message,
          timeStamp: new Date()
        });
        await chatMessage.save();
        
        console.log(`💬 Message saved: ${sendBy} - ${message.substring(0, 30)}...`);

        // Broadcast to all clients connected to this ticket
        const aWss = expressWsInstance.getWss();
        aWss.clients.forEach(client => {
          if (client.readyState === 1 && client.ticketID === ticketID) {
            client.send(JSON.stringify({
              type: 'new_message',
              message: chatMessage
            }));
          }
        });
      } else if (type === 'join_ticket') {
        ws.ticketID = ticketID;
        ws.send(JSON.stringify({
          type: 'joined_ticket',
          ticketID: ticketID
        }));
        console.log(`✅ Client joined ticket: ${ticketID}`);
      }
    } catch (error) {
      console.error('❌ WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }));
    }
  });

  ws.on('close', () => {
    console.log(`❌ WebSocket disconnected for ticket: ${ticketID}`);
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });

  // Set ticket ID on connection
  ws.ticketID = ticketID;
  ws.send(JSON.stringify({
    type: 'joined_ticket',
    ticketID: ticketID
  }));
});

// ============================================
// HEALTH CHECK & ROOT ROUTES
// ============================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Lanka Pharmacy API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.send('Lanka Pharmacy Management System - Complete API');
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

// ============================================
// START SERVER
// ============================================

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`💬 WebSocket chat available at ws://localhost:${PORT}/chat/{ticketID}`);
        console.log(`🌐 API available at http://localhost:${PORT}/api`);
        console.log(`✅ All systems operational`);
    });
}).catch(err => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});
