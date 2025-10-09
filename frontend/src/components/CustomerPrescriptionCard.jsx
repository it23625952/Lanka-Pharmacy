import { Eye, Clock, CheckCircle, XCircle, FileText, ShoppingCart } from 'lucide-react';
import React from 'react';

const CustomerPrescriptionCard = ({ prescription, onSelect, onCreateOrder }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="size-5 text-yellow-600" />;
            case 'Verified': return <CheckCircle className="size-5 text-green-600" />;
            case 'Rejected': return <XCircle className="size-5 text-red-600" />;
            default: return <FileText className="size-5 text-gray-600" />;
        }
    };

    const getStatusDescription = (status) => {
        switch (status) {
            case 'Pending': return 'Under review by our pharmacy team';
            case 'Verified': return 'Verified and ready for processing';
            case 'Rejected': return 'Could not be processed';
            default: return 'Status unknown';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Verified': return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleViewClick = () => {
        if (onSelect) {
            onSelect(prescription);
        }
    };

    const handleCreateOrderClick = () => {
        if (onCreateOrder) {
            onCreateOrder(prescription);
        }
    };

    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200'>
            <div className='p-6'>
                <div className='flex justify-between items-start'>
                    <div className='space-y-4 flex-1'>
                        <div className='flex items-center gap-4'>
                            <div className="flex items-center gap-3">
                                {getStatusIcon(prescription.status)}
                                <h3 className='text-xl font-bold text-gray-800'>Prescription #{prescription._id.slice(-6)}</h3>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(prescription.status)}`}>
                                {prescription.status}
                            </span>
                        </div>

                        <p className="text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-200">
                            {getStatusDescription(prescription.status)}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <strong>Uploaded:</strong> {new Date(prescription.createdAt).toLocaleDateString()}
                            </div>
                            <div>
                                <strong>Reference ID:</strong> {prescription._id}
                            </div>
                        </div>

                        {prescription.verifiedAt && (
                            <div className="text-sm text-gray-600">
                                <strong>Verified on:</strong> {new Date(prescription.verifiedAt).toLocaleDateString()}
                            </div>
                        )}

                        {/* Order Status */}
                        {prescription.order && (
                            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                                <strong className="text-blue-700">Order Created:</strong>
                                <p className="text-blue-600 text-sm mt-1">Order #{prescription.order.orderNumber}</p>
                            </div>
                        )}
                    </div>

                    <div className='flex gap-3 ml-4'>
                        <button 
                            className='btn border-2 border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50 gap-2 transition-all duration-200 flex items-center justify-center min-h-[40px]'
                            onClick={handleViewClick}
                        >
                            <Eye className='size-4' />
                            View Details
                        </button>

                        {/* Create Order Button for Verified Prescriptions */}
                        {onCreateOrder && (
                            <button 
                                className='btn bg-gradient-to-r from-green-500 to-green-600 border-none text-white hover:from-green-600 hover:to-green-700 gap-2 transition-all duration-200 flex items-center justify-center min-h-[40px]'
                                onClick={handleCreateOrderClick}
                            >
                                <ShoppingCart className='size-4' />
                                Create Order
                            </button>
                        )}
                    </div>
                </div>

                {prescription.notes && (
                    <div className='bg-blue-50 rounded-xl p-4 mt-4 border border-blue-200'>
                        <strong className="text-blue-700">Notes:</strong>
                        <p className='text-blue-600 mt-1'>{prescription.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerPrescriptionCard;