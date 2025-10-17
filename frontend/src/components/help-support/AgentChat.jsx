import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { helpSupportAPI } from '../../services/helpSupportAPI';
import { 
  Send, 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Image as ImageIcon,
  CheckCheck,
  Clock,
  User
} from 'lucide-react';

const AgentChat = () => {
  const { ticketID } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const currentAgent = {
    id: 'EMP001',
    name: 'John Doe',
    role: 'Support Agent'
  };

  useEffect(() => {
    loadTicketAndMessages();
  }, [ticketID]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadTicketAndMessages = async () => {
    setLoading(true);
    try {
      const ticketResponse = await helpSupportAPI.getTicketById(ticketID);
      setTicket(ticketResponse.data);

      const messagesResponse = await helpSupportAPI.getChatMessages(ticketID);
      setMessages(messagesResponse.data || []);
    } catch (error) {
      console.error('Error loading ticket and messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    setSending(true);
    
    const messageData = {
      ticketID,
      senderID: currentAgent.id,
      senderName: currentAgent.name,
      senderType: 'Agent',
      messageText: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, { ...messageData, _id: Date.now(), status: 'sending' }]);
    setNewMessage('');

    try {
      const response = await helpSupportAPI.sendChatMessage(messageData);
      setMessages(prev => 
        prev.map(msg => msg._id === Date.now() ? response.data : msg)
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg._id !== Date.now()));
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'bg-red-100 text-red-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600 mb-4">Ticket not found</p>
        <button 
          onClick={() => navigate('/agent/dashboard')}
          className="text-emerald-600 hover:text-emerald-800"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/agent/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{ticket.customerName || 'Customer'}</h2>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <span className="text-gray-500">#{ticket.ticketID}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isAgent = message.senderType === 'Agent';
            
            return (
              <div key={message._id || index} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md ${isAgent ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-lg px-4 py-3 ${isAgent ? 'bg-emerald-600 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                    {!isAgent && <p className="text-xs font-medium mb-1 text-emerald-600">{message.senderName}</p>}
                    <p className="text-sm">{message.messageText}</p>
                    <div className={`flex items-center justify-end space-x-1 mt-2 text-xs ${isAgent ? 'text-emerald-100' : 'text-gray-500'}`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {isAgent && (message.status === 'sending' ? <Clock className="w-3 h-3" /> : <CheckCheck className="w-3 h-3" />)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <button type="button" className="text-gray-600 hover:text-gray-900">
            <Paperclip className="w-5 h-5" />
          </button>
          <button type="button" className="text-gray-600 hover:text-gray-900">
            <ImageIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgentChat;
