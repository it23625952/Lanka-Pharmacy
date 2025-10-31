import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

const CustomerInfoCard = ({ order }) => {
    return (
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
    );
};

export default CustomerInfoCard;