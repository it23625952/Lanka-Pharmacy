import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  BarChart3, 
  ArrowLeft, 
  Package, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Truck,
  DollarSign,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useNavigate } from 'react-router';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const OrderVolumeDashboard = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get(`/reports/order-volume?range=${timeRange}`);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      setDashboardData(response.data);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(`Failed to load dashboard data: ${err.response?.data?.message || err.message}`);
      toast.error('Failed to load dashboard data');
      
      // Fallback to empty data structure
      const fallbackData = {
        summary: {
          totalOrders: 0,
          completedOrders: 0,
          pendingOrders: 0,
          cancelledOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0
        },
        dailyOrders: [],
        orderStatusDistribution: [
          { name: 'Completed', value: 0 },
          { name: 'Pending', value: 0 },
          { name: 'Processing', value: 0 },
          { name: 'Ready for Pickup', value: 0 },
          { name: 'Cancelled', value: 0 }
        ],
        paymentMethodDistribution: [
          { name: 'Cash on Delivery', value: 0 },
          { name: 'Card Payment', value: 0 },
          { name: 'Digital Wallet', value: 0 },
          { name: 'Bank Transfer', value: 0 }
        ],
        topProducts: []
      };
      
      setDashboardData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToOrders = () => {
    navigate('/staff/orders');
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'emerald', trend }) => {
    const colorClasses = {
      emerald: {
        text: 'text-emerald-600',
        bg: 'bg-emerald-100'
      },
      amber: {
        text: 'text-amber-600',
        bg: 'bg-amber-100'
      },
      red: {
        text: 'text-red-600',
        bg: 'bg-red-100'
      },
      blue: {
        text: 'text-blue-600',
        bg: 'bg-blue-100'
      },
      purple: {
        text: 'text-purple-600',
        bg: 'bg-purple-100'
      }
    };

    const colors = colorClasses[color] || colorClasses.emerald;

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-gray-600 text-sm font-medium mb-1 truncate">{title}</p>
            <p className={`text-2xl font-bold ${colors.text} mb-1 break-words`}>{value}</p>
            {subtitle && (
              <p className="text-gray-500 text-xs truncate">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-xs ${trend.value > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                <TrendingUp className={`w-3 h-3 ${trend.value < 0 ? 'rotate-180' : ''}`} />
                <span>{trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colors.bg} flex-shrink-0 ml-3`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
        </div>
      </div>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'Pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Processing': return <Package className="w-5 h-5 text-orange-500" />;
      case 'Ready for Pickup': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'Cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Processing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Ready for Pickup': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper functions for metrics
  const calculateCompletionRate = () => {
    if (!dashboardData?.summary?.totalOrders || dashboardData.summary.totalOrders === 0) return 0;
    return (dashboardData.summary.completedOrders / dashboardData.summary.totalOrders) * 100;
  };

  const calculateCancellationRate = () => {
    if (!dashboardData?.summary?.totalOrders || dashboardData.summary.totalOrders === 0) return 0;
    return (dashboardData.summary.cancelledOrders / dashboardData.summary.totalOrders) * 100;
  };

  const calculateAvgDailyOrders = () => {
    if (!dashboardData?.dailyOrders?.length) return 0;
    return Math.round(dashboardData.dailyOrders.reduce((acc, day) => acc + day.orders, 0) / dashboardData.dailyOrders.length);
  };

  const calculateAvgDailyRevenue = () => {
    if (!dashboardData?.dailyOrders?.length) return 0;
    return (dashboardData.dailyOrders.reduce((acc, day) => acc + day.revenue, 0) / dashboardData.dailyOrders.length);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNTk2NjkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDJvMmgtMnptMCA0aDJvMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
      
      <Navbar />

      <div className='flex-1 container mx-auto px-4 py-8 max-w-7xl relative z-10'>
        {/* Header Section */}
        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12'>
          <div className='flex items-center gap-4'>
            <button 
              onClick={handleBackToOrders}
              className="p-2 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className='text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent'>
                Order Analytics Dashboard
              </h1>
              <p className='text-gray-600 text-base lg:text-lg mt-1'>Comprehensive order performance and trend analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select 
              className='px-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800' 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value='7days'>Last 7 Days</option>
              <option value='30days'>Last 30 Days</option>
              <option value='90days'>Last 90 Days</option>
              <option value='1year'>Last Year</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 mb-8'>
          <StatCard
            title="Total Orders"
            value={dashboardData.summary.totalOrders}
            icon={ShoppingCart}
            color="emerald"
          />
          <StatCard
            title="Completed"
            value={dashboardData.summary.completedOrders}
            icon={CheckCircle}
            color="emerald"
          />
          <StatCard
            title="Pending"
            value={dashboardData.summary.pendingOrders}
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Cancelled"
            value={dashboardData.summary.cancelledOrders}
            icon={XCircle}
            color="red"
          />
          <StatCard
            title="Total Revenue"
            value={`LKR ${dashboardData.summary.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="blue"
          />
          <StatCard
            title="Avg Order Value"
            value={`LKR ${dashboardData.summary.averageOrderValue.toFixed(2)}`}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Charts Grid */}
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mb-8'>
          {/* Daily Orders & Revenue Trend - Takes 2 columns */}
          <div className='xl:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6'>
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-gray-800">Daily Orders & Revenue Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis yAxisId="left" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value, name) => [
                    name === 'Revenue (LKR)' ? `LKR ${value.toLocaleString()}` : value, 
                    name
                  ]}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="orders" fill="#10b981" name="Orders" radius={[8, 8, 0, 0]} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  name="Revenue (LKR)"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Distribution - Takes 1 column */}
          <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6'>
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-gray-800">Order Status</h3>
            </div>
            <div className="space-y-3">
              {dashboardData.orderStatusDistribution.map((status, index) => (
                <div key={status.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getStatusIcon(status.name)}
                    <span className="font-medium text-gray-800 text-sm truncate">{status.name}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(status.name)}`}>
                      {status.value}
                    </span>
                    <span className="text-xs text-gray-500 w-12 text-right">
                      {dashboardData.summary.totalOrders > 0 ? 
                        ((status.value / dashboardData.summary.totalOrders) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Charts Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8'>
          {/* Payment Methods */}
          <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6'>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Payment Methods</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={dashboardData.paymentMethodDistribution}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" name="Orders" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6'>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Top Products by Orders</h3>
            {dashboardData.topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardData.topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="orders" fill="#f59e0b" name="Orders" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                No product data available
              </div>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6'>
          <h3 className="text-xl font-bold text-gray-800 mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-200">
              <div className="text-2xl lg:text-3xl font-bold text-emerald-600 mb-2">{calculateCompletionRate().toFixed(1)}%</div>
              <div className="text-xs lg:text-sm text-emerald-700 font-medium">Completion Rate</div>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200">
              <div className="text-2xl lg:text-3xl font-bold text-red-600 mb-2">{calculateCancellationRate().toFixed(1)}%</div>
              <div className="text-xs lg:text-sm text-red-700 font-medium">Cancellation Rate</div>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
              <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">{calculateAvgDailyOrders()}</div>
              <div className="text-xs lg:text-sm text-blue-700 font-medium">Avg Daily Orders</div>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
              <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-2 break-words">LKR {calculateAvgDailyRevenue().toFixed(0)}</div>
              <div className="text-xs lg:text-sm text-purple-700 font-medium">Avg Daily Revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderVolumeDashboard;