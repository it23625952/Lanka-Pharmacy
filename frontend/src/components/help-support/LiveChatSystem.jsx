import React, { useState, useEffect, useRef } from 'react';
import { helpSupportAPI } from '../../services/helpSupportAPI';
import websocketService from '../../services/websocketService';
import { 
  MessageCircle, 
  Send, 
  User, 
  UserCheck, 
  Clock, 
  Wifi, 
  WifiOff,
  Minimize2,
  Maximize2,
  X
} from 'lucide-react';

const LiveChatSystem = ({ ticketID = null, standalone = true }) => {
  // State management
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(ticketID);
  const [userTickets, setUserTickets] = useState([]);
  
  // Refs
  const messagesEndRef = useRef(null);
  const messageHandlersRef = useRef([]);
  
  // User info (would come from auth context)
  const currentUser = {
    id: 'CUST123',
    name: 'Customer',
    type: 'customer'
  };

  useEffect(() => {
    loadUserTickets();
    return () => {
      // Cleanup: remove all message handlers
      messageHandlersRef.current.forEach(({ type, handler }) => {
        websocketService.offMessage(type, handler);
      });
      websocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      loadChatHistory();
      connectWebSocket();
    }
    return () => {
      // Cleanup on ticket change
      messageHandlersRef.current.forEach(({ type, handler }) => {
        websocketService.offMessage(type, handler);
      });
      messageHandlersRef.current = [];
      websocketService.disconnect();
    };
  }, [selectedTicket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUserTickets = async () => {
    try {
      const response = await helpSupportAPI.getCustomerTickets(currentUser.id);
      const tickets = Array.isArray(response.data) 
        ? response.data 
        : response.data?.tickets || [];
      
      setUserTickets(tickets.filter(ticket => 
        ticket.status === 'Open' || ticket.status === 'In Progress'
      ));
    } catch (error) {
      console.error('Error loading tickets:', error);
      setUserTickets([]);
    }
  };

  const loadChatHistory = async () => {
  if (!selectedTicket) return;
  
  setLoading(true);
  try {
    // ✅ FIX: Extract ticketID if selectedTicket is an object
    const ticketIDString = typeof selectedTicket === 'object' 
      ? selectedTicket.ticketID 
      : selectedTicket;
    
    console.log('🔍 Loading history for ticket:', ticketIDString); // Debug
    
    const response = await helpSupportAPI.getChatHistory(ticketIDString);
    
    // ✅ Handle both response formats
    const messagesData = response.data?.messages || response.data || [];
    
    setMessages(Array.isArray(messagesData) ? messagesData : []);
    setChatStarted(messagesData && messagesData.length > 0);
  } catch (error) {
    console.error('Error loading chat history:', error);
    setMessages([]);
  } finally {
    setLoading(false);
  }
};

  const connectWebSocket = async () => {
    try {
      await websocketService.connect(selectedTicket);
      
      // Handler for new messages
      const newMessageHandler = (data) => {
        setMessages(prev => {
          const currentMessages = Array.isArray(prev) ? prev : [];
          return [...currentMessages, data.message];
        });
        setChatStarted(true);
      };

      // Handler for chat history
      const chatHistoryHandler = (data) => {
        const messages = Array.isArray(data.messages) ? data.messages : [];
        setMessages(messages);
        setChatStarted(messages.length > 0);
      };

      // Handler for joined ticket confirmation
      const joinedHandler = (data) => {
        console.log(`✅ Joined chat for ticket: ${data.ticketID}`);
      };

      // Handler for errors
      const errorHandler = (data) => {
        console.error('❌ Chat error:', data.message);
      };

      // Register all handlers
      websocketService.onMessage('new_message', newMessageHandler);
      websocketService.onMessage('chat_history', chatHistoryHandler);
      websocketService.onMessage('joined_ticket', joinedHandler);
      websocketService.onMessage('error', errorHandler);

      // Store handlers for cleanup
      messageHandlersRef.current = [
        { type: 'new_message', handler: newMessageHandler },
        { type: 'chat_history', handler: chatHistoryHandler },
        { type: 'joined_ticket', handler: joinedHandler },
        { type: 'error', handler: errorHandler }
      ];

      // Connection status handler
      websocketService.onConnection((isConnected) => {
        setConnected(isConnected);
        console.log(isConnected ? '✅ WebSocket Connected' : '❌ WebSocket Disconnected');
      });

      setConnected(true);
    } catch (error) {
      console.error('Failed to connect:', error);
      setConnected(false);
    }
  };

  const sendMessage = () => {
    if (!currentMessage.trim() || !connected || !selectedTicket) return;

    const success = websocketService.send({
      type: 'chat_message',
      sendBy: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.type,
      message: currentMessage.trim()
    });

    if (success) {
      setCurrentMessage('');
    } else {
      console.error('Failed to send message - WebSocket not connected');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getConnectionStatus = () => {
    const status = websocketService.getConnectionStatus();
    
    if (status === 'connecting') return { text: 'Connecting...', color: 'text-yellow-600', icon: Clock };
    if (status === 'connected') return { text: 'Connected', color: 'text-green-600', icon: Wifi };
    return { text: 'Disconnected', color: 'text-red-600', icon: WifiOff };
  };

  // If standalone is false, render as embedded widget
  if (!standalone) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${minimized ? 'w-64' : 'w-80'} bg-white border border-gray-300 rounded-lg shadow-2xl`}>
        {/* Widget Header */}
        <div className="bg-emerald-600 text-white p-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Live Chat</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setMinimized(!minimized)}
              className="text-white hover:bg-emerald-700 p-1 rounded"
            >
              {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {!minimized && (
          <div className="h-96">
            {/* Condensed chat interface for widget mode */}
            <div className="text-center p-8 text-gray-600">
              Widget mode - Use full page for complete experience
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <MessageCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Live Chat Support</h2>
        <p className="text-gray-600">
          Get real-time help from our pharmacy experts
        </p>
      </div>

      {/* Ticket Selection */}
      {!selectedTicket && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Ticket to Chat About</h3>
          {userTickets.length > 0 ? (
            <div className="space-y-3">
              {userTickets.map(ticket => (
                <div 
                  key={ticket._id}
                  onClick={() => setSelectedTicket(ticket.ticketID)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-emerald-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                      <p className="text-sm text-gray-600">ID: {ticket.ticketID}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You don't have any open tickets to chat about.</p>
              <button 
                onClick={() => window.location.href = '/help-support'}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create a Ticket First
              </button>
            </div>
          )}
        </div>
      )}

      {/* Chat Interface */}
      {selectedTicket && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          
          {/* Chat Header */}
          <div className="bg-gray-50 border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Chat - Ticket #{selectedTicket}
                </h3>
                <p className="text-sm text-gray-600">
                  {userTickets.find(t => t.ticketID === selectedTicket)?.subject}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Connection Status */}
                <div className="flex items-center space-x-2">
                  {(() => {
                    const status = getConnectionStatus();
                    const Icon = status.icon;
                    return (
                      <>
                        <Icon className={`w-4 h-4 ${status.color}`} />
                        <span className={`text-sm ${status.color}`}>{status.text}</span>
                      </>
                    );
                  })()}
                </div>
                
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
  {loading ? (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      <span className="ml-2 text-gray-600">Loading chat history...</span>
    </div>
  ) : !chatStarted ? (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <MessageCircle className="w-16 h-16 text-gray-400 mb-4" />
      <p className="text-lg font-semibold text-gray-700">Chat hasn't started yet</p>
      <p className="text-sm text-gray-500 mt-2">Send a message to begin!</p>
    </div>
  ) : messages.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-full">
      <MessageCircle className="w-16 h-16 text-gray-400 mb-4" />
      <p className="text-gray-600">No messages yet. Start the conversation!</p>
    </div>
  ) : (
    <div className="space-y-3">
      {messages.map((msg, index) => {
        const isCustomer = msg.sendBy === currentUser.id;
        return (
          <div
            key={index}
            className={`flex items-end gap-2 ${isCustomer ? 'justify-end' : 'justify-start'}`}
          >
            {/* Left Avatar (Agent) */}
            {!isCustomer && (
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0 mb-1">
                <UserCheck className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                isCustomer
                  ? 'bg-emerald-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
              }`}
            >
              {/* Sender Name */}
              <p className={`text-xs font-semibold mb-1 ${isCustomer ? 'text-emerald-100' : 'text-gray-500'}`}>
                {isCustomer ? 'You' : 'Support Agent'}
              </p>
              
              {/* Message Text */}
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                {msg.message}
              </p>
              
              {/* Timestamp */}
              <p className={`text-xs mt-1 text-right ${isCustomer ? 'text-emerald-100' : 'text-gray-400'}`}>
                {formatTime(msg.timeStamp)}
              </p>
            </div>

            {/* Right Avatar (Customer) */}
            {isCustomer && (
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mb-1">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  )}
</div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={connected ? "Type your message..." : "Connecting to chat..."}
                disabled={!connected}
                rows={1}
                className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={sendMessage}
                disabled={!connected || !currentMessage.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            {!connected && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>Connecting to chat...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Chat Tips:</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <ul className="space-y-2">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Our pharmacy experts are available 24/7
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Have your prescription or order details ready
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Chat history is saved for your reference
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Average response time: under 2 minutes
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              All conversations are secure and confidential
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              You can continue chatting from any device
            </li>
          </ul>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-sm text-red-800">
          <strong>Medical Emergency?</strong> Don't use chat. Call emergency services immediately at <strong>102</strong> or visit your nearest emergency room.
        </p>
      </div>
    </div>
  );
};

export default LiveChatSystem;
