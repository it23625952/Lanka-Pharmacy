import { Eye } from 'lucide-react';
import React from 'react';

const StaffPrescriptionCard = ({ prescription, onSelect }) => {
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

    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200'>
            <div className='p-6'>
                <div className='flex justify-between items-start'>
                    <div className='space-y-3'>
                        <div className='flex items-center gap-4'>
                            <h3 className='text-xl font-bold text-gray-800'>{prescription.customer?.name || 'Customer'}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(prescription.status)}`}>
                                {prescription.status}
                            </span>
                        </div>

                        <p className='text-gray-600 text-lg'>{prescription.customer?.email || 'No email'}</p>
                        <p className='text-gray-500 text-sm'>Uploaded: {new Date(prescription.createdAt).toLocaleDateString()}</p>
                        
                        {prescription.customer?.phone && (
                            <p className='text-gray-500 text-sm'>Phone: {prescription.customer.phone}</p>
                        )}
                    </div>

                    <div className='flex gap-3'>
                        <button 
                            className='btn border-2 border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50 gap-2 transition-all duration-200 flex items-center justify-center min-h-[40px]'
                            onClick={handleViewClick}
                        >
                            <Eye className='size-4' />
                            View Details
                        </button>
                    </div>
                </div>

                {prescription.notes && (
                    <div className='bg-gray-50 rounded-xl p-4 mt-4 border border-gray-200'>
                        <p className='text-gray-700'>{prescription.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffPrescriptionCard;