import React, { useState, useEffect } from 'react';
import { helpSupportAPI } from '../../services/helpSupportAPI';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar, 
  Clock, 
  Star, 
  MessageSquare, 
  Phone, 
  Target, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  FileText, 
  DollarSign,
  Globe,
  Shield,
  Zap,
  Award,
  RefreshCw,
  Filter,
  Download,
  Eye,
  UserPlus,
  PhoneCall,
  Mail
} from 'lucide-react';

const StaffDashboard = () => {
  // State management
  const [dashboardData, setDashboardData] = useState({
    engagement: null,
    satisfaction: null,
    interactions: null,
    callbacks: null
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('30days');
  
  // Current staff info (would come from auth context)
  const currentStaff = {
    id: 'EMP001',
    name: 'John Doe',
    role: 'Support Manager',
    department: 'Customer Relations'
  };

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [engagementResponse, satisfactionResponse, interactionsResponse, callbacksResponse] = await Promise.all([
        helpSupportAPI.getCustomerEngagement(),
        helpSupportAPI.getCustomerSatisfaction(),
        helpSupportAPI.getInteractionPatterns(),
        helpSupportAPI.getCallbackMetrics()
      ]);

      setDashboardData({
        engagement: engagementResponse.data,
        satisfaction: satisfactionResponse.data,
        interactions: interactionsResponse.data,
        callbacks: callbacksResponse.data
      });
    } catch (error) {
      console.error('Error loading staff dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  const getEngagementColor = (level) => {
    switch(level) {
      case 'High Activity': return 'text-green-700 bg-green-100';
      case 'Medium Activity': return 'text-yellow-700 bg-yellow-100';
      case 'Low Activity': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getSatisfactionColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600">Customer relationship and business insights</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Range Filter */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 3 Months</option>
            <option value="1year">Last Year</option>
          </select>
          
          {/* Export Button */}
          <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.engagement?.totalCustomers || 0}
              </p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% this month
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Customers</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.engagement?.activeCustomers || 0}
              </p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% from last month
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Satisfaction Score</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.satisfaction?.overallSatisfaction?.averageRating?.toFixed(1) || '0.0'}
              </p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <Star className="w-3 h-3 mr-1" />
                4.8 / 5.0 rating
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenue Impact</p>
              <p className="text-3xl font-bold text-gray-900">₹2.4L</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <DollarSign className="w-3 h-3 mr-1" />
                Support-driven sales
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-medium text-sm border-b-2 ${
            activeTab === 'overview'
              ? 'text-purple-600 border-purple-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline-block mr-2" />
          Business Overview
        </button>
        
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-6 py-3 font-medium text-sm border-b-2 ${
            activeTab === 'customers'
              ? 'text-purple-600 border-purple-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <Users className="w-4 h-4 inline-block mr-2" />
          Customer Analytics
        </button>
        
        <button
          onClick={() => setActiveTab('satisfaction')}
          className={`px-6 py-3 font-medium text-sm border-b-2 ${
            activeTab === 'satisfaction'
              ? 'text-purple-600 border-purple-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <Star className="w-4 h-4 inline-block mr-2" />
          Satisfaction Metrics
        </button>
        
        <button
          onClick={() => setActiveTab('operations')}
          className={`px-6 py-3 font-medium text-sm border-b-2 ${
            activeTab === 'operations'
              ? 'text-purple-600 border-purple-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <Target className="w-4 h-4 inline-block mr-2" />
          Operations
        </button>
      </div>

      {/* Tab Content */}

      {/* Business Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Customer Engagement Levels */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Engagement</h3>
              <div className="space-y-3">
                {dashboardData.engagement?.customerInteractionLevels?.map(level => (
                  <div key={level._id} className="flex justify-between items-center">
                    <span className={`px-3 py-1 text-sm rounded-full ${getEngagementColor(level._id)}`}>
                      {level._id}
                    </span>
                    <span className="font-semibold text-gray-900">{level.count} customers</span>
                  </div>
                )) || (
                  <div className="text-center py-4 text-gray-500">Loading engagement data...</div>
                )}
              </div>
            </div>

            {/* Top Issues */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Issue Categories</h3>
              <div className="space-y-3">
                {dashboardData.interactions?.issuePatterns?.slice(0, 5).map(issue => (
                  <div key={issue._id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{issue._id}</span>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">{issue.count}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-purple-600 h-1.5 rounded-full" 
                          style={{ width: `${(issue.count / Math.max(...(dashboardData.interactions?.issuePatterns || []).map(i => i.count))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4 text-gray-500">Loading issue data...</div>
                )}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Uptime</span>
                  </div>
                  <span className="font-semibold text-green-600">99.9%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-gray-600">Response Time</span>
                  </div>
                  <span className="font-semibold text-yellow-600">1.2s</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-600">API Health</span>
                  </div>
                  <span className="font-semibold text-green-600">Healthy</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Active Sessions</span>
                  </div>
                  <span className="font-semibold text-purple-600">156</span>
                </div>

              </div>
            </div>

          </div>

          {/* Support Team Performance */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Support Team Performance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Mock team member data */}
              {[
                { name: 'Sarah Johnson', resolved: 45, satisfaction: 4.9, responseTime: '1.8m', status: 'online' },
                { name: 'Mike Chen', resolved: 38, satisfaction: 4.7, responseTime: '2.1m', status: 'online' },
                { name: 'Lisa Brown', resolved: 42, satisfaction: 4.8, responseTime: '1.9m', status: 'break' },
                { name: 'David Wilson', resolved: 35, satisfaction: 4.6, responseTime: '2.3m', status: 'offline' }
              ].map(agent => (
                <div key={agent.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{agent.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        agent.status === 'online' ? 'bg-green-100 text-green-800' :
                        agent.status === 'break' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resolved</span>
                      <span className="font-medium">{agent.resolved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium text-yellow-600">{agent.satisfaction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Time</span>
                      <span className="font-medium">{agent.responseTime}</span>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Business Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Impact</h3>
              <div className="space-y-4">
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-green-700">Support-Driven Sales</p>
                    <p className="text-2xl font-bold text-green-800">₹2,40,000</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                  <div>
                    <p className="text-sm text-emerald-700">Retention Value</p>
                    <p className="text-2xl font-bold text-emerald-800">₹8,90,000</p>
                  </div>
                  <Shield className="w-8 h-8 text-emerald-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-purple-700">Avg Order Value</p>
                    <p className="text-2xl font-bold text-purple-800">₹1,245</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>

              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Efficiency</h3>
              <div className="space-y-4">
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">First Contact Resolution</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                    <span className="font-semibold text-green-600">87%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Resolution Time</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <span className="font-semibold text-emerald-600">4.2h</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Customer Effort Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <span className="font-semibold text-yellow-600">4.7</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Escalation Rate</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '8%' }}></div>
                    </div>
                    <span className="font-semibold text-green-600">8%</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* Customer Analytics Tab */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          
          {/* Customer Segmentation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers by Volume</h3>
              <div className="space-y-4">
                {dashboardData.interactions?.topCustomersByVolume?.slice(0, 5).map((customer, index) => (
                  <div key={customer._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-emerald-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Customer {customer._id}</p>
                        <p className="text-sm text-gray-600">{customer.ticketCount} tickets</p>
                      </div>
                    </div>
                    <button className="text-emerald-600 hover:text-emerald-800">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">Loading customer data...</div>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Journey Metrics</h3>
              <div className="space-y-4">
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <UserPlus className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">New Customers</p>
                      <p className="text-sm text-gray-600">This month</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-green-600">+87</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-gray-900">Repeat Customers</p>
                      <p className="text-sm text-gray-600">Loyalty rate</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-emerald-600">73%</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Churn Risk</p>
                      <p className="text-sm text-gray-600">Needs attention</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-red-600">12</span>
                </div>

              </div>
            </div>

          </div>

          {/* Customer Communication Preferences */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Communication Channel Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <MessageSquare className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">45%</p>
                <p className="text-sm text-gray-600">Live Chat</p>
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">32%</p>
                <p className="text-sm text-gray-600">Support Tickets</p>
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <PhoneCall className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">18%</p>
                <p className="text-sm text-gray-600">Phone Callbacks</p>
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Mail className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">5%</p>
                <p className="text-sm text-gray-600">Email</p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Satisfaction Metrics Tab */}
      {activeTab === 'satisfaction' && (
        <div className="space-y-6">
          
          {/* Satisfaction Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {dashboardData.satisfaction?.overallSatisfaction?.averageRating?.toFixed(1) || '4.8'}
              </p>
              <p className="text-gray-600">Overall Rating</p>
              <p className="text-sm text-gray-500 mt-2">
                Based on {dashboardData.satisfaction?.overallSatisfaction?.totalFeedbacks || 0} reviews
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-3xl font-bold text-green-600 mb-2">92%</p>
              <p className="text-gray-600">Satisfaction Rate</p>
              <p className="text-sm text-gray-500 mt-2">4+ star ratings</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <TrendingUp className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <p className="text-3xl font-bold text-emerald-600 mb-2">+5.2%</p>
              <p className="text-gray-600">Monthly Growth</p>
              <p className="text-sm text-gray-500 mt-2">vs. last month</p>
            </div>

          </div>

          {/* Rating Distribution */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Rating Distribution</h3>
            
            <div className="space-y-4">
              {dashboardData.satisfaction?.feedbackDistribution?.map(rating => (
                <div key={rating._id} className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700 w-8">
                    {rating._id} ⭐
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        rating._id >= 4 ? 'bg-green-500' : 
                        rating._id >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${(rating.count / Math.max(...dashboardData.satisfaction?.feedbackDistribution?.map(r => r.count) || [1])) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {rating.count}
                  </span>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">Loading rating distribution...</div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Operations Tab */}
      {activeTab === 'operations' && (
        <div className="space-y-6">
          
          {/* Callback Operations */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Callback Management</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Phone className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.callbacks?.pendingCallbacksByPriority?.reduce((sum, item) => sum + item.count, 0) || 0}
                </p>
                <p className="text-sm text-gray-600">Pending Callbacks</p>
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900">2.4h</p>
                <p className="text-sm text-gray-600">Avg Response Time</p>
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-900">94%</p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>

            </div>

            {/* Pending Callbacks by Priority */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Callbacks by Priority</h4>
              <div className="space-y-3">
                {dashboardData.callbacks?.pendingCallbacksByPriority?.map(priority => (
                  <div key={priority._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      priority._id === 'High' ? 'bg-red-100 text-red-700' :
                      priority._id === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {priority._id} Priority
                    </span>
                    <span className="font-semibold text-gray-900">{priority.count} callbacks</span>
                  </div>
                )) || (
                  <div className="text-center py-4 text-gray-500">Loading callback data...</div>
                )}
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">System Alerts & Notifications</h3>
            
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">High Priority Tickets</p>
                    <p className="text-sm text-red-700">3 tickets need immediate attention</p>
                  </div>
                </div>
                <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                  Review
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-900">Response Time Alert</p>
                    <p className="text-sm text-yellow-700">Average response time above target</p>
                  </div>
                </div>
                <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                  Check
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">System Status</p>
                    <p className="text-sm text-green-700">All systems operational</p>
                  </div>
                </div>
                <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                  Good
                </span>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default StaffDashboard;
