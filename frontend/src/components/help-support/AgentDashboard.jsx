import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADDED
import { helpSupportAPI } from '../../services/helpSupportAPI';
import { 
  BarChart3, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  TrendingUp,
  Activity,
  Users,
  Target,
  RefreshCw,
  Filter,
  Search,
  Eye,
  MessageCircle,
  UserCheck,
  Timer
} from 'lucide-react';


const AgentDashboard = () => {
  const navigate = useNavigate(); // ✅ ADDED
  
  // State management
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    activity: null,
    performance: null
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState('today');
  
  // Current agent info (would come from auth context)
  const currentAgent = {
    id: 'EMP001',
    name: 'John Doe',
    role: 'Support Agent',
    shift: '09:00 AM - 05:00 PM',
    extension: '101'
  };


  useEffect(() => {
    loadDashboardData();
  }, [timeFilter]);


  const loadDashboardData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);


    try {
      const [statsResponse, activityResponse, performanceResponse] = await Promise.all([
        helpSupportAPI.getDashboardStats(),
        helpSupportAPI.getRecentActivity(),
        helpSupportAPI.getPerformanceMetrics()
      ]);


      setDashboardData({
        stats: statsResponse.data,
        activity: activityResponse.data,
        performance: performanceResponse.data
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  const handleRefresh = () => {
    loadDashboardData(true);
  };


  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'text-red-600 bg-red-50 border-red-200';
      case 'In Progress': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Resolved': return 'text-green-600 bg-green-50 border-green-200';
      case 'Pending': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };


  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-700 bg-red-100';
      case 'Medium': return 'text-yellow-700 bg-yellow-100';
      case 'Low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentAgent.name}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>


      {/* Agent Info Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{currentAgent.name}</h2>
              <p className="opacity-90">{currentAgent.role} • Ext. {currentAgent.extension}</p>
              <p className="text-sm opacity-75">Shift: {currentAgent.shift}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Status</p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Online & Available</span>
            </div>
          </div>
        </div>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">My Tickets Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.stats?.totalTickets || 0}
              </p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15% from yesterday
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>


        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Resolved Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.stats?.ticketsByStatus?.find(s => s._id === 'Resolved')?.count || 0}
              </p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <CheckCircle className="w-3 h-3 mr-1" />
                89% resolution rate
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>


        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">2.3 min</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <Timer className="w-3 h-3 mr-1" />
                Under target (5 min)
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>


        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Chats</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-emerald-600 flex items-center mt-1">
                <MessageCircle className="w-3 h-3 mr-1" />
                2 waiting in queue
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>


      </div>


      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-medium text-sm border-b-2 ${
            activeTab === 'overview'
              ? 'text-emerald-600 border-emerald-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <Activity className="w-4 h-4 inline-block mr-2" />
          My Tickets
        </button>
        
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-6 py-3 font-medium text-sm border-b-2 ${
            activeTab === 'chat'
              ? 'text-emerald-600 border-emerald-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline-block mr-2" />
          Live Chat Queue
        </button>
        
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-6 py-3 font-medium text-sm border-b-2 ${
            activeTab === 'performance'
              ? 'text-emerald-600 border-emerald-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <Target className="w-4 h-4 inline-block mr-2" />
          My Performance
        </button>
      </div>


      {/* Tab Content */}
      
      {/* My Tickets Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors">
                <Search className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Search Tickets</span>
              </button>
              <button className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">Start New Chat</span>
              </button>
              <button className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
                <Phone className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-700 font-medium">Callback Queue</span>
              </button>
              <button className="flex items-center space-x-2 p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                <Mail className="w-5 h-5 text-purple-600" />
                <span className="text-purple-700 font-medium">Email Follow-up</span>
              </button>
            </div>
          </div>


          {/* Recent Tickets */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">My Recent Tickets</h3>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>All Status</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {dashboardData.activity?.recentTickets?.slice(0, 8).map(ticket => (
                <div key={ticket._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span>#{ticket.ticketID}</span>
                        <span>{ticket.category}</span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="text-emerald-600 hover:text-emerald-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      {/* ✅ UPDATED CHAT BUTTON */}
                      <button 
                        onClick={() => navigate(`/agent/chat/${ticket.ticketID}`)}
                        className="text-green-600 hover:text-green-800"
                        title="Open Chat"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="p-8 text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No tickets found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Live Chat Queue Tab */}
      {activeTab === 'chat' && (
        <div className="space-y-6">
          
          {/* Chat Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Waiting in Queue</p>
                  <p className="text-3xl font-bold text-orange-600">2</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Chats</p>
                  <p className="text-3xl font-bold text-green-600">3</p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Wait Time</p>
                  <p className="text-3xl font-bold text-emerald-600">1.2m</p>
                </div>
                <Timer className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>


          {/* Chat Queue */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Live Chat Queue</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {/* Mock chat queue data */}
              {[
                { id: 1, customer: 'Sarah Johnson', issue: 'Prescription refill question', waiting: '2 min', priority: 'High' },
                { id: 2, customer: 'Mike Chen', issue: 'Order status inquiry', waiting: '5 min', priority: 'Medium' },
                { id: 3, customer: 'Lisa Brown', issue: 'Insurance coverage', waiting: '1 min', priority: 'Low' },
              ].map(chat => (
                <div key={chat.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{chat.customer}</h4>
                        <p className="text-sm text-gray-600">{chat.issue}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Waiting</p>
                        <p className="font-medium text-gray-900">{chat.waiting}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(chat.priority)}`}>
                        {chat.priority}
                      </span>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Accept Chat
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Today's Performance */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
              <div className="space-y-4">
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tickets Resolved</span>
                  <span className="font-semibold">8 / 10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>


                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Response Time Target</span>
                  <span className="font-semibold text-green-600">✓ 2.3 min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>


                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Customer Satisfaction</span>
                  <span className="font-semibold text-green-600">4.8 / 5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>


                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Chat Sessions</span>
                  <span className="font-semibold">12 sessions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>


              </div>
            </div>


            {/* Weekly Trends */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trends</h3>
              <div className="space-y-4">
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Resolution Rate</span>
                  </div>
                  <span className="text-green-800 font-bold">+5%</span>
                </div>


                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <span className="text-emerald-800 font-medium">Response Time</span>
                  </div>
                  <span className="text-emerald-800 font-bold">-0.3m</span>
                </div>


                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <span className="text-purple-800 font-medium">Chat Volume</span>
                  </div>
                  <span className="text-purple-800 font-bold">+12%</span>
                </div>


                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-800 font-medium">Target Achievement</span>
                  </div>
                  <span className="text-yellow-800 font-bold">94%</span>
                </div>


              </div>
            </div>


          </div>


          {/* Achievements */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="bg-yellow-500 p-2 rounded-full">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-yellow-800">Speed Demon</p>
                  <p className="text-sm text-yellow-600">Fastest response time this week</p>
                </div>
              </div>


              <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="bg-green-500 p-2 rounded-full">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-green-800">Problem Solver</p>
                  <p className="text-sm text-green-600">95% first-contact resolution</p>
                </div>
              </div>


              <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="bg-emerald-500 p-2 rounded-full">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-emerald-800">Chat Master</p>
                  <p className="text-sm text-emerald-600">50+ successful chat sessions</p>
                </div>
              </div>


            </div>
          </div>


        </div>
      )}


    </div>
  );
};


export default AgentDashboard;
