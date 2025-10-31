import express from "express";
import expressWs from "express-ws";
import path from "path";
import { createServer } from 'http';
import cors from "cors";
import dotenv from "dotenv";

// Route imports
import productRoutes from "./src/routes/productRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import prescriptionRoutes from "./src/routes/prescriptionRoutes.js";
import orderRoutes from './src/routes/orderRoutes.js';

// HELP & SUPPORT ROUTE IMPORTS
import feedbackRoutes from './src/routes/feedbackRoutes.js';
import ticketRoutes from './src/routes/ticketRoutes.js';
import callbackRoutes from './src/routes/callbackRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import staffDashboardRoutes from './src/routes/staffDashboardRoutes.js';

// Model import
import ChatMessage from './src/models/ChatMessage.js';

// Configuration imports
import { connectDB } from "./src/config/db.js";
import { JWT_SECRET } from "./src/config/jwt.js";
import rateLimiter from "./src/middleware/rateLimiter.js";

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

const server = createServer(app);
const expressWsInstance = expressWs(app);

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
app.use("/api/users", userRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/orders", orderRoutes);

// HELP & SUPPORT API ROUTES
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/callbacks", callbackRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/staff-dashboard", staffDashboardRoutes);

// WebSocket route for live chat
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

  ws.ticketID = ticketID;
  ws.send(JSON.stringify({
    type: 'joined_ticket',
    ticketID: ticketID
  }));
});

// Database connection and server startup
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`💬 WebSocket chat available at ws://localhost:${PORT}/chat/{ticketID}`);
        console.log(`🌐 API available at http://localhost:${PORT}/api`);
    });
});
