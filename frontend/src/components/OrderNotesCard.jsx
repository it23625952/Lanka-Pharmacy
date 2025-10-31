import React from 'react';

const OrderNotesCard = ({ order }) => {
    if (!order.notes) return null;

    return (
        <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 p-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Order Notes</h2>
            <p className='text-gray-700 text-lg leading-relaxed'>{order.notes}</p>
        </div>
    );
};

export default OrderNotesCard;