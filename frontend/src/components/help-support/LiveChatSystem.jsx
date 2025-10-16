import React, { useState, useEffect, useRef } from 'react';
import { helpSupportAPI } from '../../services/helpSupportAPI';
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
  const [connecting, setConnecting] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(ticketID);
  const [userTickets, setUserTickets] = useState([]);
  
  // WebSocket and refs
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  
  // User info (would come from auth context)
  const currentUser = {
    id: 'CUST123',
    name: 'Customer',
    type: 'customer'
  };

  useEffect(() => {
    loadUserTickets();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      loadChatHistory();
      connectWebSocket();
    }
    return () => disconnectWebSocket();
  }, [selectedTicket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUserTickets = async () => {
  try {
    const response = await helpSupportAPI.getCustomerTickets(currentUser.id);
    
    // ✅ FIX: Check if response.data is an array
    const tickets = Array.isArray(response.data) 
      ? response.data 
      : response.data?.tickets || [];
    
    setUserTickets(tickets.filter(ticket => 
      ticket.status === 'Open' || ticket.status === 'In Progress'
    ));
  } catch (error) {
    console.error('Error loading tickets:', error);
    setUserTickets([]); // ✅ Set empty array on error
  }
};


  const loadChatHistory = async () => {
    if (!selectedTicket) return;
    
    setLoading(true);
    try {
      const response = await helpSupportAPI.getChatHistory(selectedTicket);
      setMessages(response.data || []);
      setChatStarted(response.data && response.data.length > 0);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    if (!selectedTicket || ws.current?.readyState === WebSocket.OPEN) return;

    setConnecting(true);
    ws.current = new WebSocket(`ws://localhost:5001/chat/${selectedTicket}`);
    
    ws.current.onopen = () => {
      setConnected(true);
      setConnecting(false);
      reconnectAttemptsRef.current = 0;
      
      // Join the ticket room
      ws.current.send(JSON.stringify({
        type: 'join_ticket',
        ticketID: selectedTicket
      }));
    };

    ws.current.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'chat_history') {
    // ✅ FIX: Ensure messages is an array
    const messages = Array.isArray(data.messages) ? data.messages : [];
    setMessages(messages);
    setChatStarted(messages.length > 0);
  } else if (data.type === 'new_message') {
    setMessages(prev => {
      // ✅ FIX: Ensure prev is always an array
      const currentMessages = Array.isArray(prev) ? prev : [];
      return [...currentMessages, data.message];
    });
    setChatStarted(true);
  } else if (data.type === 'joined_ticket') {
    console.log(`Joined chat for ticket: ${data.ticketID}`);
  } else if (data.type === 'error') {
    console.error('Chat error:', data.message);
  }
};


    ws.current.onclose = () => {
      setConnected(false);
      setConnecting(false);
      
      // Auto-reconnect logic
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++;
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 2000 * reconnectAttemptsRef.current); // Exponential backoff
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
      setConnecting(false);
    };
  };

  const disconnectWebSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    setConnected(false);
    setConnecting(false);
  };

  const sendMessage = () => {
  if (!currentMessage.trim() || !connected || !selectedTicket) return;

  const messageData = {
    type: 'chat_message',
    sendBy: currentUser.id,
    senderName: currentUser.name, 
    senderRole: currentUser.type,  
    message: currentMessage.trim()
  };

  ws.current.send(JSON.stringify(messageData));
  setCurrentMessage('');
};


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    if (userTickets.length > 0) {
      setSelectedTicket(userTickets[0].ticketID);
    } else {
      // Could redirect to create ticket or show message
      alert('Please create a support ticket first to start a chat.');
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
    if (connecting) return { text: 'Connecting...', color: 'text-yellow-600', icon: Clock };
    if (connected) return { text: 'Connected', color: 'text-green-600', icon: Wifi };
    return { text: 'Disconnected', color: 'text-red-600', icon: WifiOff };
  };

  // If standalone is false, render as embedded widget
  if (!standalone) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${minimized ? 'w-64' : 'w-80'} bg-white border border-gray-300 rounded-lg shadow-2xl`}>
        {/* Widget Header */}
        <div className="bg-blue-600 text-white p-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Live Chat</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setMinimized(!minimized)}
              className="text-white hover:bg-blue-700 p-1 rounded"
            >
              {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {!minimized && (
          <div className="h-96">
            {/* Rest of chat interface in smaller format */}
            {/* This would be a condensed version of the main chat */}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
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
                  className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
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
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading chat history...</span>
              </div>
            ) : !chatStarted ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Chat hasn't started yet. Send a message to begin!
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isCustomer = msg.sendBy === currentUser.id;
                return (
                  <div
                    key={index}
                    className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isCustomer 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-900'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        {isCustomer ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                        <span className="text-xs font-medium">
                          {isCustomer ? 'You' : 'Support Agent'}
                        </span>
                        <span className={`text-xs ${isCustomer ? 'text-blue-200' : 'text-gray-500'}`}>
                          {formatTime(msg.timeStamp)}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={connected ? "Type your message..." : "Connect to start chatting..."}
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
                <Clock className="w-4 h-4" />
                <span>
                  {connecting 
                    ? 'Connecting to chat...' 
                    : `Reconnecting... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
                  }
                </span>
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
