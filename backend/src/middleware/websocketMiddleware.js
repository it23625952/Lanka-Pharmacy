// middleware/websocketMiddleware.js
import expressWs from "express-ws";
import ChatMessage from "../models/ChatMessage.js";

export const setupWebSocket = (app) => {
  // Enable WebSocket support on Express app
  const expressWsInstance = expressWs(app);

  // WebSocket route for live chat
  app.ws('/chat/:ticketID', async (ws, req) => {
    const ticketID = req.params.ticketID;
    console.log(`✅ WebSocket connected for ticket: ${ticketID}`);

    // Send chat history to newly connected client
    try {
      const chatHistory = await ChatMessage.find({ ticketID })
        .sort({ timeStamp: 1 })
        .limit(50); // Last 50 messages

      ws.send(JSON.stringify({
        type: 'chat_history',
        messages: chatHistory
      }));
      
      console.log(`📨 Sent ${chatHistory.length} messages to client`);
    } catch (error) {
      console.error('❌ Error sending chat history:', error);
    }

    // Handle incoming messages
    ws.on('message', async (data) => {
      try {
        const messageData = JSON.parse(data);
        const { sendBy, senderName, senderRole, message, type = 'chat_message' } = messageData;

        if (type === 'chat_message') {
          // Validation
          if (!sendBy || !senderName || !senderRole || !message) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Missing required fields: sendBy, senderName, senderRole, message'
            }));
            return;
          }

          // Save message to MongoDB
          const chatMessage = new ChatMessage({
            ticketID,
            sendBy,
            senderName,
            senderRole,
            message,
            timeStamp: new Date()
          });
          
          await chatMessage.save();
          console.log(`💬 Message saved: ${message.substring(0, 30)}...`);

          // Broadcast message to all clients connected to this ticket
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
          // Store ticket ID with WebSocket connection
          ws.ticketID = ticketID;
          ws.send(JSON.stringify({
            type: 'joined_ticket',
            ticketID: ticketID
          }));
          console.log(`👤 Client joined ticket: ${ticketID}`);
        }

      } catch (error) {
        console.error('❌ WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message: ' + error.message
        }));
      }
    });

    // Handle connection close
    ws.on('close', () => {
      console.log(`🔌 WebSocket disconnected for ticket: ${ticketID}`);
    });

    // Handle connection errors
    ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
    });

    // Store ticket ID with WebSocket connection for filtering
    ws.ticketID = ticketID;
  });

  console.log('✅ WebSocket server initialized on /chat/:ticketID');
  return expressWsInstance;
};

// Add this export to match what server.js is importing
export const initWebSocketServer = (server) => {
  console.log('✅ WebSocket server initialized');
  return setupWebSocket(server);
};

// Default export for convenience
export default { setupWebSocket, initWebSocketServer };
