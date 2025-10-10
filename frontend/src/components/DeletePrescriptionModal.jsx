import { Trash2, X } from 'lucide-react';
import React from 'react';

const DeletePrescriptionModal = ({ prescription, isOpen, onClose, onConfirm, isDeleting }) => {
    if (!isOpen || !prescription) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Trash2 className="size-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Delete Prescription</h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                        disabled={isDeleting}
                    >
                        <X className="size-5" />
                    </button>
                </div>
                
                {/* Modal Content */}
                <div className="mb-6">
                    <p className="text-gray-600 mb-3">
                        Are you sure you want to delete this prescription? This action cannot be undone.
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-sm">
                            <strong>Prescription #{prescription._id.slice(-6)}</strong>
                        </p>
                        <p className="text-red-600 text-sm mt-1">
                            Uploaded: {new Date(prescription.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-red-600 text-sm">
                            Status: <span className="font-semibold">{prescription.status}</span>
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button 
                        className="btn border-2 border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 flex-1 py-3 transition-all duration-200"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button 
                        className="btn bg-gradient-to-r from-red-600 to-red-700 border-none text-white hover:from-red-700 hover:to-red-800 flex-1 py-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Trash2 className="size-5" />
                        )}
                        {isDeleting ? 'Deleting...' : 'Delete Prescription'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeletePrescriptionModal;