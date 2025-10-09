import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Package, Clock, CheckCircle, XCircle, Truck, User, Mail, Phone, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useParams, useNavigate, Link } from 'react-router';

const OrderDetailPage = () => {
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/orders/${id}`);
            setOrder(response.data);
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Failed to load order details');
            navigate('/my-orders');
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrderStatus = async (newStatus) => {
        try {
            setIsUpdating(true);
            await api.put(`/orders/${id}/status`, { status: newStatus });
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrder(); // Refresh order data
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="size-6 text-yellow-600" />;
            case 'Confirmed': return <CheckCircle className="size-6 text-blue-600" />;
            case 'Processing': return <Package className="size-6 text-orange-600" />;
            case 'Ready for Pickup': return <Truck className="size-6 text-green-600" />;
            case 'Completed': return <CheckCircle className="size-6 text-green-600" />;
            case 'Cancelled': return <XCircle className="size-6 text-red-600" />;
            default: return <Package className="size-6 text-gray-600" />;
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

    if (isLoading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col'>
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col'>
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
                        <Link to="/my-orders" className="btn bg-blue-600 text-white">Back to Orders</Link>
                    </div>
                </div>
            </div>
        );
    }

    const isStaff = ['Owner', 'Manager', 'Staff'].includes(localStorage.getItem('userRole'));

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col'>
            <Navbar />

            <div className='flex-1 container mx-auto px-4 py-8 max-w-6xl'>
                {/* Header */}
                <div className='flex items-center gap-4 mb-8'>
                    <Link to={isStaff ? "/staff/orders" : "/my-orders"} className="btn btn-ghost btn-circle">
                        <ArrowLeft className="size-6" />
                    </Link>
                    <div>
                        <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
                            Order #{order.orderNumber}
                        </h1>
                        <p className='text-gray-600 text-lg'>Order details and tracking</p>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Main Order Information */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Order Status Card */}
                        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
                            <div className='flex items-center justify-between mb-6'>
                                <div className='flex items-center gap-4'>
                                    {getStatusIcon(order.status)}
                                    <div>
                                        <h2 className='text-2xl font-bold text-gray-800'>Current Status</h2>
                                        <span className={`px-4 py-2 rounded-full text-lg font-semibold border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Status Update (Staff Only) */}
                                {isStaff && !['Completed', 'Cancelled'].includes(order.status) && (
                                    <select 
                                        className='select select-lg border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 text-gray-800'
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(e.target.value)}
                                        disabled={isUpdating}
                                    >
                                        <option value='Pending'>Pending</option>
                                        <option value='Confirmed'>Confirmed</option>
                                        <option value='Processing'>Processing</option>
                                        <option value='Ready for Pickup'>Ready for Pickup</option>
                                        <option value='Completed'>Completed</option>
                                        <option value='Cancelled'>Cancelled</option>
                                    </select>
                                )}
                            </div>

                            {/* Status Timeline */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="size-5 text-blue-600" />
                                    <span><strong>Order Placed:</strong> {new Date(order.createdAt).toLocaleString()}</span>
                                </div>
                                
                                {order.estimatedReadyTime && (
                                    <div className="flex items-center gap-3 text-blue-600">
                                        <Clock className="size-5" />
                                        <span><strong>Estimated Ready:</strong> {new Date(order.estimatedReadyTime).toLocaleString()}</span>
                                    </div>
                                )}
                                
                                {order.pickedUpAt && (
                                    <div className="flex items-center gap-3 text-green-600">
                                        <CheckCircle className="size-5" />
                                        <span><strong>Picked Up:</strong> {new Date(order.pickedUpAt).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
                            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Order Items</h2>
                            <div className='space-y-4'>
                                {order.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-800 text-lg">
                                                {item.product?.name || 'Product'}
                                            </div>
                                            {item.dosage && (
                                                <div className="text-sm text-gray-600">Dosage: {item.dosage}</div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-gray-800">
                                                {item.quantity} x LKR {item.price?.toFixed(2)}
                                            </div>
                                            <div className="text-lg font-bold text-gray-800">
                                                LKR {(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Total Amount */}
                            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                                <strong className="text-gray-800 text-xl">Total Amount:</strong>
                                <strong className="text-gray-800 text-xl">LKR {order.totalAmount?.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Information */}
                    <div className='space-y-6'>
                        {/* Customer Information */}
                        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
                            <h2 className='text-xl font-bold text-gray-800 mb-4'>Customer Information</h2>
                            <div className='space-y-3'>
                                <div className="flex items-center gap-3">
                                    <User className="size-5 text-blue-600" />
                                    <span className="text-gray-700">{order.customer?.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="size-5 text-blue-600" />
                                    <span className="text-gray-700">{order.customer?.email}</span>
                                </div>
                                {order.customer?.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="size-5 text-blue-600" />
                                        <span className="text-gray-700">{order.customer.phone}</span>
                                    </div>
                                )}
                                {order.shippingAddress && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="size-5 text-blue-600 mt-1" />
                                        <span className="text-gray-700">{order.shippingAddress}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Information */}
                        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
                            <h2 className='text-xl font-bold text-gray-800 mb-4'>Order Information</h2>
                            <div className='space-y-3 text-gray-700'>
                                <div><strong>Payment Method:</strong> {order.paymentMethod}</div>
                                <div><strong>Payment Status:</strong> {order.paymentStatus}</div>
                                <div><strong>Items Count:</strong> {order.items?.length || 0}</div>
                                {order.prescription && (
                                    <div>
                                        <strong>Prescription:</strong>{' '}
                                        <Link 
                                            to={isStaff ? `/staff/prescriptions` : `/my-prescriptions`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            View Prescription
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        {order.notes && (
                            <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
                                <h2 className='text-xl font-bold text-gray-800 mb-4'>Order Notes</h2>
                                <p className='text-gray-700'>{order.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;