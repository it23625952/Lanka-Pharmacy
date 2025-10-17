import React from 'react';
import { Clock, CheckCircle, XCircle, Truck, Package, Calendar } from 'lucide-react';

const OrderStatusCard = ({ order, isStaff, isUpdating, onStatusUpdate }) => {
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

    return (
        <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 p-8'>
            <div className='flex items-center justify-between mb-8'>
                <div className='flex items-center gap-6'>
                    {getStatusIcon(order.status)}
                    <div className="flex items-center gap-6">
                        <h2 className='text-3xl font-bold text-gray-800'>Current Status:</h2>
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
                        onChange={(e) => onStatusUpdate(e.target.value)}
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
    );
};

export default OrderStatusCard;