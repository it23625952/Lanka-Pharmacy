import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { helpSupportAPI } from '../../services/helpSupportAPI';
import { Ticket, Plus, Clock, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';

const TicketSystem = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [ticketForm, setTicketForm] = useState({
    customerID: 'CUST123',
    subject: '',
    description: '',
    category: '',
    priority: 'Medium'
  });

  const categories = [
    'Prescription Issues',
    'Order Status & Tracking',
    'Delivery Problems',
    'Payment & Billing',
    'Product Information',
    'Account Issues',
    'Insurance Claims',
    'Medication Questions',
    'Return & Refund',
    'Other'
  ];

  useEffect(() => {
    if(activeTab === 'list') {
      loadTickets();
    }
  }, [activeTab]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await helpSupportAPI.getCustomerTickets('CUST123');
      setTickets(response.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await helpSupportAPI.createTicket(ticketForm);
      alert(`Ticket created successfully! Ticket ID: ${response.data.ticketID}`);
      setTicketForm({
        ...ticketForm,
        subject: '',
        description: '',
        category: ''
      });
      setActiveTab('list');
    } catch (error) {
      alert('Error creating ticket: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ START CHAT FUNCTION
  const handleStartChat = (ticketId) => {
    try {
      navigate(`/help-support/chat/${ticketId}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'bg-red-100 text-red-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Open': return <AlertCircle className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Ticket className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-3">Support Tickets</h2>
          <p className="text-gray-600 text-xl">Submit and track your support requests</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-md ${
              activeTab === 'create'
                ? 'bg-emerald-600 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Plus className="w-5 h-5" />
            Create Ticket
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-md ${
              activeTab === 'list'
                ? 'bg-emerald-600 text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Ticket className="w-5 h-5" />
            My Tickets
          </button>
        </div>

        {/* Create Ticket Tab */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl mx-auto p-10">
            <form onSubmit={handleSubmitTicket} className="space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                  <select
                    required
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  rows={5}
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Please provide detailed information about your issue, including order numbers, prescription details, etc."
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-6 h-6" />
                    Create Ticket
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* My Tickets Tab */}
        {activeTab === 'list' && (
          <div>
            {loading ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-6 text-gray-600 text-lg font-semibold">Loading tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl max-w-xl mx-auto p-12 text-center">
                <Ticket className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-gray-900 mb-3">No tickets yet</h3>
                <p className="text-gray-600 text-lg mb-8">You haven't submitted any support requests</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {tickets.map((ticket) => (
                  <div key={ticket._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-8">
                    <div className="flex items-start justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">{ticket.subject}</h3>
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Ticket ID</p>
                        <p className="text-sm font-mono font-semibold">{ticket.ticketID}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Category</p>
                        <p className="text-sm font-semibold">{ticket.category}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Priority</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          ticket.priority === 'High' ? 'bg-red-100 text-red-700' : 
                          ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-green-100 text-green-700'
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Created</p>
                        <p className="text-sm font-semibold">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-6 leading-relaxed">{ticket.description}</p>
                    
                    {/* ✅ ONLY START CHAT BUTTON */}
                    <button
                      onClick={() => handleStartChat(ticket.ticketID)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Start Chat
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketSystem;
