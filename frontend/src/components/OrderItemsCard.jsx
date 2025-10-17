import React from 'react';

const OrderItemsCard = ({ order }) => {
    return (
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
    );
};

export default OrderItemsCard;