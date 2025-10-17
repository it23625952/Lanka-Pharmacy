import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
<<<<<<< HEAD
import { Package, Clock, CheckCircle, XCircle, Truck, User, Mail, Phone, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useParams, useNavigate, Link } from 'react-router';
=======
import { ArrowLeft } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useParams, useNavigate, Link } from 'react-router';
import OrderStatusCard from '../components/OrderStatusCard';
import OrderItemsCard from '../components/OrderItemsCard';
import CustomerInfoCard from '../components/CustomerInfoCard';
import OrderInfoCard from '../components/OrderInfoCard';
import OrderNotesCard from '../components/OrderNotesCard';
>>>>>>> 3629bc058dd523a30a13d914a487001cb3767493

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
<<<<<<< HEAD
            setOrder(response.data);
=======
            setOrder(response.data.order);
>>>>>>> 3629bc058dd523a30a13d914a487001cb3767493
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
            fetchOrder();
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        } finally {
            setIsUpdating(false);
        }
    };

<<<<<<< HEAD
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="size-8 text-yellow-600" />;
            case 'Confirmed': return <CheckCircle className="size-8 text-emerald-600" />;
            case 'Processing': return <Package className="size-8 text-orange-600" />;
            case 'Ready for Pickup': return <Truck className="size-8 text-green-600" />;
            case 'Completed': return <CheckCircle className="size-8 text-green-600" />;
            case 'Cancelled': return <XCircle className="size-8 text-red-600" />;
            default: return <Package className="size-8 text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-2 border-yellow-200';
            case 'Confirmed': return 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200';
            case 'Processing': return 'bg-orange-100 text-orange-800 border-2 border-orange-200';
            case 'Ready for Pickup': return 'bg-green-100 text-green-800 border-2 border-green-200';
            case 'Completed': return 'bg-green-100 text-green-800 border-2 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-2 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-2 border-gray-200';
        }
    };

=======
>>>>>>> 3629bc058dd523a30a13d914a487001cb3767493
    if (isLoading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Order Not Found</h2>
                        <Link to="/my-orders" className="btn bg-gradient-to-r from-emerald-600 to-emerald-800 border-none text-white px-8 py-4 text-lg rounded-2xl">
                            Back to Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isStaff = ['Owner', 'Manager', 'Staff'].includes(localStorage.getItem('userRole'));

    return (
        <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
            <Navbar />

            <div className='flex-1 container mx-auto px-4 py-8 max-w-7xl'>
                {/* Header Section */}
                <div className='flex items-center gap-6 mb-12'>
                    <Link 
                        to={isStaff ? "/staff/orders" : "/my-orders"} 
                        className="btn btn-ghost btn-circle bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-2xl transition-all duration-300"
                    >
                        <ArrowLeft className="size-6" />
                    </Link>
                    <div>
                        <h1 className='text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent'>
                            Order #{order.orderNumber}
                        </h1>
                        <p className='text-gray-600 text-xl mt-2'>Order details and tracking</p>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Main Content */}
                    <div className='lg:col-span-2 space-y-8'>
<<<<<<< HEAD
                        {/* Order Status Card */}
                        <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 p-8'>
                            <div className='flex items-center justify-between mb-8'>
                                <div className='flex items-center gap-6'>
                                    {getStatusIcon(order.status)}
                                    <div>
                                        <h2 className='text-3xl font-bold text-gray-800 mb-2'>Current Status</h2>
                                        <span className={`px-6 py-3 rounded-2xl text-xl font-semibold border-2 ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Status Update (Staff Only) */}
                                {isStaff && !['Completed', 'Cancelled'].includes(order.status) && (
                                    <select 
                                        className='py-4 px-6 border-2 border-gray-200 bg-white rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 text-gray-800 text-lg'
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
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-gray-600 text-lg">
                                    <Calendar className="size-6 text-emerald-600" />
                                    <span><strong>Order Placed:</strong> {new Date(order.createdAt).toLocaleString()}</span>
                                </div>
                                
                                {order.estimatedReadyTime && (
                                    <div className="flex items-center gap-4 text-emerald-600 text-lg">
                                        <Clock className="size-6" />
                                        <span><strong>Estimated Ready:</strong> {new Date(order.estimatedReadyTime).toLocaleString()}</span>
                                    </div>
                                )}
                                
                                {order.pickedUpAt && (
                                    <div className="flex items-center gap-4 text-green-600 text-lg">
                                        <CheckCircle className="size-6" />
                                        <span><strong>Picked Up:</strong> {new Date(order.pickedUpAt).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 p-8'>
                            <h2 className='text-3xl font-bold text-gray-800 mb-8'>Order Items</h2>
                            <div className='space-y-6'>
                                {order.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-800 text-xl">
                                                {item.product?.name || 'Product'}
                                            </div>
                                            {item.dosage && (
                                                <div className="text-lg text-gray-600 mt-2">Dosage: {item.dosage}</div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-gray-800 text-lg">
                                                {item.quantity} x LKR {item.price?.toFixed(2)}
                                            </div>
                                            <div className="text-xl font-bold text-gray-800 mt-2">
                                                LKR {(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Total Amount */}
                            <div className="flex justify-between items-center mt-8 pt-8 border-t-2 border-gray-200">
                                <strong className="text-gray-800 text-2xl">Total Amount:</strong>
                                <strong className="text-gray-800 text-2xl">LKR {order.totalAmount?.toFixed(2)}</strong>
                            </div>
                        </div>
=======
                        <OrderStatusCard
                            order={order}
                            isStaff={isStaff}
                            isUpdating={isUpdating}
                            onStatusUpdate={updateOrderStatus}
                        />
                        <OrderItemsCard order={order} />
>>>>>>> 3629bc058dd523a30a13d914a487001cb3767493
                    </div>

                    {/* Sidebar Information */}
                    <div className='space-y-8'>
<<<<<<< HEAD
                        {/* Customer Information */}
                        <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 p-8'>
                            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Customer Information</h2>
                            <div className='space-y-4'>
                                <div className="flex items-center gap-4">
                                    <User className="size-6 text-emerald-600" />
                                    <span className="text-gray-700 text-lg">{order.customer?.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Mail className="size-6 text-emerald-600" />
                                    <span className="text-gray-700 text-lg">{order.customer?.email}</span>
                                </div>
                                {order.customer?.phone && (
                                    <div className="flex items-center gap-4">
                                        <Phone className="size-6 text-emerald-600" />
                                        <span className="text-gray-700 text-lg">{order.customer.phone}</span>
                                    </div>
                                )}
                                {order.shippingAddress && (
                                    <div className="flex items-start gap-4">
                                        <MapPin className="size-6 text-emerald-600 mt-2" />
                                        <span className="text-gray-700 text-lg">{order.shippingAddress}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Information */}
                        <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 p-8'>
                            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Order Information</h2>
                            <div className='space-y-4 text-gray-700 text-lg'>
                                <div><strong>Payment Method:</strong> {order.paymentMethod}</div>
                                <div><strong>Payment Status:</strong> {order.paymentStatus}</div>
                                <div><strong>Items Count:</strong> {order.items?.length || 0}</div>
                                {order.prescription && (
                                    <div>
                                        <strong>Prescription:</strong>{' '}
                                        <Link 
                                            to={isStaff ? `/staff/prescriptions` : `/my-prescriptions`}
                                            className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200"
                                        >
                                            View Prescription
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notes Section */}
                        {order.notes && (
                            <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 p-8'>
                                <h2 className='text-2xl font-bold text-gray-800 mb-6'>Order Notes</h2>
                                <p className='text-gray-700 text-lg leading-relaxed'>{order.notes}</p>
                            </div>
                        )}
=======
                        <CustomerInfoCard order={order} />
                        <OrderInfoCard order={order} isStaff={isStaff} />
                        <OrderNotesCard order={order} />
>>>>>>> 3629bc058dd523a30a13d914a487001cb3767493
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;