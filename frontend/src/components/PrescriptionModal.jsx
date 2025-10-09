import { X, CheckCircle, XCircle, Phone, User, Mail, Calendar, FileText, Hash } from 'lucide-react';
import React from 'react';

const PrescriptionModal = ({ prescription, isOpen, onClose, onVerify, onReject }) => {
    if (!isOpen || !prescription) return null;

    // Construct the correct image URL
    const getImageUrl = () => {
        if (!prescription.prescriptionImage) return null;
        
        // If it's already a full URL, return as is
        if (prescription.prescriptionImage.startsWith('http')) {
            return prescription.prescriptionImage;
        }
        
        // Convert file path to URL (replace backslashes with forward slashes)
        const imagePath = prescription.prescriptionImage.replace(/\\/g, '/');
        return `http://localhost:5001/${imagePath}`;
    };

    const imageUrl = getImageUrl();
    const isPending = prescription.status === 'Pending';

    // Status badge with icon
    const getStatusIcon = () => {
        switch (prescription.status) {
            case 'Pending': return <FileText className="size-4" />;
            case 'Verified': return <CheckCircle className="size-4" />;
            case 'Rejected': return <XCircle className="size-4" />;
            default: return <FileText className="size-4" />;
        }
    };

    // Helper function to safely get verified by information
    const getVerifiedByInfo = () => {
        if (!prescription.verifiedBy) return null;
        
        // If verifiedBy is an object (populated user), get the name
        if (typeof prescription.verifiedBy === 'object') {
            return prescription.verifiedBy.name || `Staff ID: ${prescription.verifiedBy._id}`;
        }
        
        // If it's just an ID string
        return `Staff ID: ${prescription.verifiedBy}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl max-h-full overflow-auto w-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800">
                        Prescription for {prescription.customer?.name || 'Customer'}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2"
                    >
                        <X className="size-6" />
                    </button>
                </div>
                
                <div className="p-8">
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={`Prescription for ${prescription.customer?.name || 'Customer'}`}
                            className="w-full h-auto rounded-xl shadow-lg max-h-[70vh] object-contain border border-gray-200"
                            onError={(e) => {
                                console.error('Failed to load image:', imageUrl);
                                e.target.style.display = 'none';
                                // Show fallback message
                                const fallback = document.getElementById(`fallback-${prescription._id}`);
                                if (fallback) fallback.style.display = 'block';
                            }}
                        />
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-gray-500 text-xl">No prescription image available</p>
                        </div>
                    )}
                    
                    {/* Fallback if image fails to load */}
                    <div 
                        id={`fallback-${prescription._id}`}
                        className="hidden text-center py-12 bg-gray-100 rounded-xl border border-gray-200"
                        style={{display: 'none'}}
                    >
                        <p className="text-gray-500 text-xl">Failed to load prescription image</p>
                        <p className="text-gray-400 text-md mt-3">
                            Path: {prescription.prescriptionImage}
                        </p>
                        <p className="text-gray-400 text-md">
                            Constructed URL: {imageUrl}
                        </p>
                    </div>

                    {/* Additional prescription info */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-600">
                        {/* Customer Name */}
                        <div className="flex items-center gap-3">
                            <User className="size-5 text-blue-600 flex-shrink-0" />
                            <strong className="text-gray-700 min-w-[100px]">Customer:</strong> 
                            <span className="text-gray-800">
                                {prescription.customer?.name || 'N/A'}
                            </span>
                        </div>
                        
                        {/* Email */}
                        <div className="flex items-center gap-3">
                            <Mail className="size-5 text-blue-600 flex-shrink-0" />
                            <strong className="text-gray-700 min-w-[100px]">Email:</strong> 
                            <span className="text-gray-800">
                                {prescription.customer?.email || 'N/A'}
                            </span>
                        </div>
                        
                        {/* Mobile */}
                        <div className="flex items-center gap-3">
                            <Phone className="size-5 text-blue-600 flex-shrink-0" />
                            <strong className="text-gray-700 min-w-[100px]">Mobile:</strong> 
                            <span className="text-gray-800">
                                {prescription.customer?.phone || 'Not provided'}
                            </span>
                        </div>
                        
                        {/* Status */}
                        <div className="flex items-center gap-3">
                            {getStatusIcon()}
                            <strong className="text-gray-700 min-w-[100px]">Status:</strong> 
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                prescription.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                prescription.status === 'Verified' ? 'bg-green-100 text-green-800 border border-green-200' :
                                'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                                {prescription.status}
                            </span>
                        </div>
                        
                        {/* Uploaded Date */}
                        <div className="flex items-center gap-3">
                            <Calendar className="size-5 text-blue-600 flex-shrink-0" />
                            <strong className="text-gray-700 min-w-[100px]">Uploaded:</strong> 
                            <span className="text-gray-800">{new Date(prescription.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {/* Reference ID */}
                        <div className="flex items-center gap-3">
                            <Hash className="size-5 text-blue-600 flex-shrink-0" />
                            <strong className="text-gray-700 min-w-[100px]">Reference ID:</strong> 
                            <span className="text-gray-800 font-mono">{prescription._id}</span>
                        </div>
                    </div>

                    {prescription.notes && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="size-5 text-blue-600" />
                                <strong className="text-gray-700 text-lg">Notes:</strong>
                            </div>
                            <p className="text-gray-600 text-lg">{prescription.notes}</p>
                        </div>
                    )}

                    {/* Products Information (if verified) */}
                    {prescription.products && prescription.products.length > 0 && (
                        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="size-5 text-green-600" />
                                <strong className="text-green-700 text-lg">Prescribed Products:</strong>
                            </div>
                            <div className="space-y-3">
                                {prescription.products.map((product, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-100">
                                        <div>
                                            <div className="font-semibold text-gray-800">
                                                {product.productId?.name || 'Product'}
                                            </div>
                                            {product.dosage && (
                                                <div className="text-sm text-gray-600">Dosage: {product.dosage}</div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-gray-800">
                                                Quantity: {product.quantity}
                                            </div>
                                            {product.productId?.retailPrice && (
                                                <div className="text-sm text-gray-600">
                                                    LKR {(product.productId.retailPrice * product.quantity).toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {prescription.totalAmount > 0 && (
                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-green-200">
                                    <strong className="text-green-700 text-lg">Total Amount:</strong>
                                    <strong className="text-green-700 text-lg">LKR {prescription.totalAmount.toFixed(2)}</strong>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons for Pending Prescriptions */}
                    {isPending && onVerify && onReject && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h4 className="text-xl font-bold text-gray-800 mb-6">Prescription Actions</h4>
                            <div className="flex gap-6">
                                <button
                                    onClick={() => onVerify(prescription)}
                                    className="btn bg-gradient-to-r from-green-500 to-green-600 border-none text-white hover:from-green-600 hover:to-green-700 gap-3 shadow-lg hover:shadow-xl transition-all duration-200 flex-1 py-4 text-lg flex items-center justify-center min-h-[60px]"
                                >
                                    <CheckCircle className="size-6" />
                                    Verify Prescription
                                </button>
                                <button
                                    onClick={() => onReject(prescription)}
                                    className="btn bg-gradient-to-r from-red-500 to-red-600 border-none text-white hover:from-red-600 hover:to-red-700 gap-3 shadow-lg hover:shadow-xl transition-all duration-200 flex-1 py-4 text-lg flex items-center justify-center min-h-[60px]"
                                >
                                    <XCircle className="size-6" />
                                    Reject Prescription
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Verification Info (if already verified/rejected) */}
                    {!isPending && prescription.verifiedBy && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h4 className="text-xl font-bold text-gray-800 mb-4">Verification Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-600">
                                <div className="flex items-center gap-3">
                                    <User className="size-5 text-blue-600 flex-shrink-0" />
                                    <strong className="text-gray-700 min-w-[120px]">Verified By:</strong> 
                                    <span className="text-gray-800">{getVerifiedByInfo()}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="size-5 text-blue-600 flex-shrink-0" />
                                    <strong className="text-gray-700 min-w-[120px]">Verified At:</strong> 
                                    <span className="text-gray-800">{prescription.verifiedAt ? new Date(prescription.verifiedAt).toLocaleString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrescriptionModal;