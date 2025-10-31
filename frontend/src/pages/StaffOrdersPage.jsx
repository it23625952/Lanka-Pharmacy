import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Search, Package, Clock, CheckCircle, XCircle, Truck, User, Mail, Phone, Filter, BarChart3 } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

const StaffOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const url = filter === 'all' 
                ? '/orders' 
                : `/orders?status=${filter}`;
            
            const response = await api.get(url);
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="size-5 text-amber-500" />;
            case 'Confirmed': return <CheckCircle className="size-5 text-blue-500" />;
            case 'Processing': return <Package className="size-5 text-orange-500" />;
            case 'Ready for Pickup': return <Truck className="size-5 text-emerald-500" />;
            case 'Completed': return <CheckCircle className="size-5 text-emerald-600" />;
            case 'Cancelled': return <XCircle className="size-5 text-red-500" />;
            default: return <Package className="size-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Processing': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Ready for Pickup': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredOrders = orders.filter(order => 
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const calculateTotalItems = (order) => {
        return order.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNTk2NjkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDJvMmgtMnptMCA0aDJvMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
            
            <Navbar />

            <div className='flex-1 container mx-auto px-4 py-8 max-w-7xl relative z-10'>
                {/* Header Section */}
                <div className='text-center mb-12'>
                    <h1 className='text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4'>
                        Orders Management
                    </h1>
                    <p className='text-gray-600 text-xl mb-8'>Manage and track customer orders efficiently</p>
                    
                    {/* Dashboard Button */}
                    <Link 
                        to="/staff/orders/dashboard"
                        className='inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-emerald-500/20'
                    >
                        <BarChart3 className="size-6" />
                        View Order Analytics Dashboard
                    </Link>
                </div>

                {/* Search and Filter Controls */}
                <div className='bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100'>
                    <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
                        <div className='flex-1 w-full'>
                            <div className='relative'>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Search className="size-5" />
                                </div>
                                <input 
                                    type='text' 
                                    placeholder='Search by order number, customer name, or email...' 
                                    className='w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500' 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <Filter className="size-5 text-emerald-600" />
                            <select 
                                className='w-full lg:w-48 pl-4 pr-10 py-4 border-2 border-gray-200 bg-white rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800' 
                                value={filter} 
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value='all'>All Orders</option>
                                <option value='Pending'>Pending</option>
                                <option value='Confirmed'>Confirmed</option>
                                <option value='Processing'>Processing</option>
                                <option value='Ready for Pickup'>Ready for Pickup</option>
                                <option value='Completed'>Completed</option>
                                <option value='Cancelled'>Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl shadow-2xl border border-gray-100">
                        {orders.length === 0 ? (
                            <div className="space-y-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                    <Package className="size-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">No Orders Found</h3>
                                <p className="text-gray-600 max-w-md mx-auto text-lg">
                                    There are no orders in the database. Orders will appear here once customers create them from verified prescriptions.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto">
                                    <Search className="size-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">No Matching Orders</h3>
                                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                                <div className="text-sm text-gray-400 pt-4 border-t border-gray-200">
                                    Total orders: {orders.length} | Filtered out: {orders.length - filteredOrders.length}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='grid gap-6'>
                        {filteredOrders.map(order => (
                            <div key={order._id} className='bg-white rounded-3xl shadow-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden'>
                                {/* Order Header */}
                                <div className='bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6'>
                                    <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
                                        <div className='flex items-center gap-4'>
                                            {getStatusIcon(order.status)}
                                            <h3 className='text-2xl font-bold text-white'>Order #{order.orderNumber}</h3>
                                        </div>
                                        <div className='flex items-center gap-4'>
                                            <span className={`px-4 py-2 rounded-2xl text-sm font-semibold border-2 border-white/30 backdrop-blur-sm ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <Link 
                                                to={`/staff/orders/${order._id}`}
                                                className='px-6 py-2 border-2 border-white text-white bg-transparent hover:bg-white/10 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2'
                                            >
                                                <Package className='size-4' />
                                                Manage Order
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className='p-8'>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Customer Information */}
                                        <div className="space-y-6">
                                            <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Customer Details</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                                        <User className="size-5 text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{order.customer?.name}</p>
                                                        <p className="text-sm text-gray-600">Customer</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                                        <Mail className="size-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{order.customer?.email}</p>
                                                        <p className="text-sm text-gray-600">Email</p>
                                                    </div>
                                                </div>
                                                {order.customer?.phone && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                                                            <Phone className="size-5 text-teal-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{order.customer.phone}</p>
                                                            <p className="text-sm text-gray-600">Phone</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Order Information */}
                                        <div className="space-y-6">
                                            <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Order Information</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                    <p className="text-gray-600">Total Items</p>
                                                    <p className="text-xl font-bold text-emerald-600">{calculateTotalItems(order)}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                    <p className="text-gray-600">Total Amount</p>
                                                    <p className="text-xl font-bold text-emerald-600">LKR {order.totalAmount?.toFixed(2)}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                    <p className="text-gray-600">Payment Method</p>
                                                    <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                    <p className="text-gray-600">Order Date</p>
                                                    <p className="font-semibold text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {order.estimatedReadyTime && (
                                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                                    <p className="text-emerald-800 font-semibold">
                                                        Estimated Ready: {new Date(order.estimatedReadyTime).toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="flex-1">
                                                <h5 className="font-semibold text-gray-700 mb-2">Quick Status Update</h5>
                                                {!['Completed', 'Cancelled'].includes(order.status) ? (
                                                    <select 
                                                        className='w-full sm:w-64 pl-4 pr-10 py-3 border-2 border-gray-200 bg-white rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800'
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                    >
                                                        <option value='Pending'>Pending</option>
                                                        <option value='Confirmed'>Confirmed</option>
                                                        <option value='Processing'>Processing</option>
                                                        <option value='Ready for Pickup'>Ready for Pickup</option>
                                                        <option value='Completed'>Complete Order</option>
                                                        <option value='Cancelled'>Cancel Order</option>
                                                    </select>
                                                ) : (
                                                    <p className="text-gray-500 italic">Order is {order.status.toLowerCase()}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Notes */}
                                    {order.notes && (
                                        <div className='bg-gray-50 rounded-xl p-4 mt-6 border border-gray-200'>
                                            <strong className="text-gray-700 block mb-2">Order Notes:</strong>
                                            <p className='text-gray-600'>{order.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffOrdersPage;