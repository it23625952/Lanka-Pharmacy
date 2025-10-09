import React, { useState } from 'react';
import { X, XCircle } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const RejectPrescriptionModal = ({ prescription, isOpen, onClose, onSuccess }) => {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put(`/prescriptions/${prescription._id}/reject`, {
                reason
            });

            toast.success('Prescription rejected successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error rejecting prescription:', error);
            toast.error(error.response?.data?.message || 'Failed to reject prescription');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setReason('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800">
                        Reject Prescription
                    </h3>
                    <button 
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2"
                    >
                        <X className="size-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-600 mb-4">
                            You are about to reject the prescription for <strong>{prescription.customerName}</strong>. 
                            Please provide a reason for rejection.
                        </p>
                        
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Reason for Rejection *
                        </label>
                        <textarea
                            className="textarea w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            rows="4"
                            placeholder="e.g., Prescription is unclear, medication not available, requires doctor consultation..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleClose}
                            className="btn border-2 border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 flex-1"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!reason.trim() || isSubmitting}
                            className="btn bg-gradient-to-r from-red-500 to-red-600 border-none text-white hover:from-red-600 hover:to-red-700 flex-1 gap-2"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <XCircle className="size-5" />
                            )}
                            {isSubmitting ? 'Rejecting...' : 'Reject Prescription'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RejectPrescriptionModal;