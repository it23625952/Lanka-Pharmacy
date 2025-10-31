import React from 'react';
import { Link } from 'react-router';

const OrderInfoCard = ({ order, isStaff }) => {
    return (
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
    );
};

export default OrderInfoCard;