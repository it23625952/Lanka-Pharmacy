import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Support APIs connecting to your backend
export const helpSupportAPI = {
  // Part 1: Tickets
  createTicket: (ticketData) => api.post('/tickets', ticketData),
  getCustomerTickets: (customerID) => api.get(`/tickets/customer/${customerID}`),
  updateTicket: (ticketID, updates) => api.patch(`/tickets/${ticketID}`, updates),
  getTicketById: (ticketID) => api.get(`/tickets/${ticketID}`),
  
  // Part 2: Feedback
  submitFeedback: (feedbackData) => api.post('/feedbacks', feedbackData),
  getFeedback: () => api.get('/feedbacks'),
  
  // Part 3: Callbacks
  requestCallback: (callbackData) => api.post('/callbacks', callbackData),
  getCustomerCallbacks: (customerID) => api.get(`/callbacks/customer/${customerID}`),
  
  // Part 4: Chat - ✅ FIXED TO MATCH YOUR BACKEND
  getChatHistory: (ticketID) => api.get(`/chats/history/${ticketID}`),
  sendChatMessage: (messageData) => api.post('/messages/:ticketID', messageData),
  
  // Part 5: Agent Dashboard
  getDashboardStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/activity'),
  getPerformanceMetrics: () => api.get('/dashboard/performance'),
  
  // Part 6: Staff Dashboard  
  getCustomerEngagement: () => api.get('/staff-dashboard/engagement'),
  getCustomerSatisfaction: () => api.get('/staff-dashboard/satisfaction'),
  getInteractionPatterns: () => api.get('/staff-dashboard/interactions'),
  getCallbackMetrics: () => api.get('/staff-dashboard/callbacks'),
};

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
