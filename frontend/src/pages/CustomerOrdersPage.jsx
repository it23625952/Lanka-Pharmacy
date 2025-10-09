import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Search, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

const CustomerOrdersPage = () => {
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
                ? '/orders/customer/my-orders' 
                : `/orders/customer/my-orders?status=${filter}`;
            
            const response = await api.get(url);
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load your orders');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="size-5 text-yellow-600" />;
            case 'Confirmed': return <CheckCircle className="size-5 text-blue-600" />;
            case 'Processing': return <Package className="size-5 text-orange-600" />;
            case 'Ready for Pickup': return <Truck className="size-5 text-green-600" />;
            case 'Completed': return <CheckCircle className="size-5 text-green-600" />;
            case 'Cancelled': return <XCircle className="size-5 text-red-600" />;
            default: return <Package className="size-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Processing': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Ready for Pickup': return 'bg-green-100 text-green-800 border-green-200';
            case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredOrders = orders.filter(order => 
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const calculateTotalItems = (order) => {
        return order.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col'>
            <Navbar />

            <div className='flex-1 container mx-auto px-4 py-8 max-w-6xl'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3'>
                        My Orders
                    </h1>
                    <p className='text-gray-600 text-lg'>Track and manage your medication orders</p>
                </div>

                {/* Filters and Search */}
                <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8'>
                    <div className='flex flex-col sm:flex-row gap-4 w-full lg:w-auto'>
                        <div className='relative w-full sm:w-80'>
                            <input 
                                type='text' 
                                placeholder='Search by order number...' 
                                className='input input-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder-gray-500 pr-12' 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <button className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200'>
                                <Search className='size-5' />
                            </button>
                        </div>

                        <select 
                            className='select select-lg w-full sm:w-48 border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800' 
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

                    <div className="text-sm text-gray-600">
                        {orders.length} order(s) found
                    </div>
                </div>

                {/* Orders List */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
                        {orders.length === 0 ? (
                            <div className="space-y-4">
                                <Package className="size-16 text-gray-400 mx-auto" />
                                <h3 className="text-xl font-semibold text-gray-700">No orders found</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    You haven't placed any orders yet. Create your first order from a verified prescription.
                                </p>
                                <Link 
                                    to="/my-prescriptions" 
                                    className="btn bg-gradient-to-r from-blue-600 to-blue-800 border-none text-white hover:from-blue-700 hover:to-blue-900 px-6 py-3 inline-flex items-center gap-2"
                                >
                                    <Package className="size-4" />
                                    View Prescriptions
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Search className="size-12 text-gray-400 mx-auto" />
                                <h3 className="text-xl font-semibold text-gray-700">No matching orders</h3>
                                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='grid gap-6'>
                        {filteredOrders.map(order => (
                            <div key={order._id} className='bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200'>
                                <div className='p-6'>
                                    <div className='flex justify-between items-start'>
                                        <div className='space-y-4 flex-1'>
                                            <div className='flex items-center gap-4'>
                                                <div className="flex items-center gap-3">
                                                    {getStatusIcon(order.status)}
                                                    <h3 className='text-xl font-bold text-gray-800'>Order #{order.orderNumber}</h3>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                <div>
                                                    <strong>Total Amount:</strong> LKR {order.totalAmount?.toFixed(2)}
                                                </div>
                                                <div>
                                                    <strong>Items:</strong> {calculateTotalItems(order)} products
                                                </div>
                                                <div>
                                                    <strong>Placed:</strong> {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            {order.estimatedReadyTime && (
                                                <div className="text-sm text-gray-600">
                                                    <strong>Estimated Ready:</strong> {new Date(order.estimatedReadyTime).toLocaleString()}
                                                </div>
                                            )}

                                            {order.pickedUpAt && (
                                                <div className="text-sm text-green-600">
                                                    <strong>Picked Up:</strong> {new Date(order.pickedUpAt).toLocaleString()}
                                                </div>
                                            )}
                                        </div>

                                        <div className='flex gap-3 ml-4'>
                                            <Link 
                                                to={`/orders/${order._id}`}
                                                className='btn border-2 border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50 gap-2 transition-all duration-200 flex items-center justify-center min-h-[40px]'
                                            >
                                                <Package className='size-4' />
                                                View Details
                                            </Link>
                                        </div>
                                    </div>

                                    {order.notes && (
                                        <div className='bg-gray-50 rounded-xl p-4 mt-4 border border-gray-200'>
                                            <strong className="text-gray-700">Notes:</strong>
                                            <p className='text-gray-600 mt-1'>{order.notes}</p>
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

export default CustomerOrdersPage;