import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { ArrowLeft } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useParams, useNavigate, Link } from 'react-router';
import OrderStatusCard from '../components/OrderStatusCard';
import OrderItemsCard from '../components/OrderItemsCard';
import CustomerInfoCard from '../components/CustomerInfoCard';
import OrderInfoCard from '../components/OrderInfoCard';
import OrderNotesCard from '../components/OrderNotesCard';

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
            setOrder(response.data.order);
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
                        <OrderStatusCard
                            order={order}
                            isStaff={isStaff}
                            isUpdating={isUpdating}
                            onStatusUpdate={updateOrderStatus}
                        />
                        <OrderItemsCard order={order} />
                    </div>

                    {/* Sidebar Information */}
                    <div className='space-y-8'>
                        <CustomerInfoCard order={order} />
                        <OrderInfoCard order={order} isStaff={isStaff} />
                        <OrderNotesCard order={order} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;