import React, { useState } from 'react';
import { X, XCircle, AlertTriangle, FileText } from 'lucide-react';
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
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                                <AlertTriangle className="size-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Reject Prescription</h3>
                                <p className="text-red-100 text-sm">This action will notify the customer</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleClose}
                            className="text-white hover:text-red-100 transition-colors duration-200 p-2 hover:bg-white/10 rounded-xl"
                        >
                            <X className="size-6" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-8">
                        {/* Prescription Information */}
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                            <div className="flex items-start gap-4">
                                <FileText className="size-6 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-red-800 text-lg mb-2">Prescription Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-red-700 text-sm">
                                        <div>
                                            <span className="font-medium">Customer:</span>
                                            <p className="font-semibold">{prescription.customerName}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Reference ID:</span>
                                            <p className="font-mono font-semibold">{prescription._id?.slice(-8)}</p>
                                        </div>
                                        {prescription.doctorName && (
                                            <div>
                                                <span className="font-medium">Doctor:</span>
                                                <p>{prescription.doctorName}</p>
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-medium">Items:</span>
                                            <p>{prescription.products?.length || 0} medications</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Warning Message */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-amber-800 font-medium">
                                        This action cannot be undone. The customer will be notified of the rejection.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Rejection Reason Input */}
                        <div className="space-y-4">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-3">
                                <XCircle className="size-5 text-red-600" />
                                Reason for Rejection *
                            </label>
                            <div className="relative">
                                <textarea
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none"
                                    rows="4"
                                    placeholder="Please provide a clear reason for rejection...
• Prescription is unclear or illegible
• Medication not available or out of stock
• Requires doctor consultation or clarification
• Invalid prescription format or missing information
• Other concerns..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                                <div className="absolute left-4 top-4 text-gray-400">
                                    <FileText className="size-5" />
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm">
                                This reason will be shared with the customer to help them understand the issue.
                            </p>
                        </div>

                        {/* Common Rejection Reasons */}
                        {!reason && (
                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-4">
                                <h5 className="font-medium text-gray-700 text-sm mb-2">Common rejection reasons:</h5>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    {[
                                        "Prescription is unclear or illegible",
                                        "Medication not available",
                                        "Requires doctor consultation",
                                        "Invalid prescription format",
                                        "Missing dosage information"
                                    ].map((commonReason, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setReason(commonReason)}
                                            className="text-left text-gray-600 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                                        >
                                            {commonReason}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex-shrink-0 border-t border-gray-200 bg-white">
                    <div className="p-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleClose}
                                className="flex-1 py-4 border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                                disabled={isSubmitting}
                            >
                                <X className="size-5" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!reason.trim() || isSubmitting}
                                className="flex-1 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Rejecting...</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="size-5" />
                                        <span>Reject Prescription</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Final Warning */}
                        <div className="text-center mt-6">
                            <p className="text-red-600 text-sm font-semibold">
                                ⚠️ This will notify the customer and cannot be undone
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RejectPrescriptionModal;