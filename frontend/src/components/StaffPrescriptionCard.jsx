import { Eye, User, Mail, Phone, Calendar } from 'lucide-react';
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
        <div className='bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300'>
            <div className='p-8'>
                <div className='flex justify-between items-start'>
                    <div className='space-y-6 flex-1'>
                        <div className='flex items-center gap-4'>
                            <h3 className='text-2xl font-bold text-gray-800'>{prescription.customer?.name || 'Customer'}</h3>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(prescription.status)}`}>
                                {prescription.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-lg text-gray-600">
                            <div className="flex items-center gap-3">
                                <Mail className="size-5 text-emerald-600" />
                                <span>{prescription.customer?.email || 'No email'}</span>
                            </div>
                            {prescription.customer?.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="size-5 text-emerald-600" />
                                    <span>{prescription.customer.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <Calendar className="size-5 text-emerald-600" />
                                <span>Uploaded: {new Date(prescription.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className='flex gap-4 ml-6'>
                        <button 
                            className='btn border-2 border-emerald-500 text-emerald-600 bg-transparent hover:bg-emerald-50 hover:border-emerald-600 gap-3 transition-all duration-300 flex items-center justify-center min-h-[52px] px-6 rounded-2xl font-semibold text-lg'
                            onClick={handleViewClick}
                        >
                            <Eye className='size-5' />
                            View Details
                        </button>
                    </div>
                </div>

                {prescription.notes && (
                    <div className='bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mt-6 border-2 border-gray-200'>
                        <p className='text-gray-700 text-lg'>{prescription.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffPrescriptionCard;