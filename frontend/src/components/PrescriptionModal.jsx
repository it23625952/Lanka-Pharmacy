import { X, CheckCircle, XCircle, Phone, User, Mail, Calendar, FileText, Hash, Package, AlertCircle } from 'lucide-react';
import React from 'react';

const PrescriptionModal = ({ prescription, isOpen, onClose, onVerify, onReject }) => {
    if (!isOpen || !prescription) return null;

    // Construct image URL from prescription image path
    const getImageUrl = () => {
        if (!prescription.prescriptionImage) return null;
        
        if (prescription.prescriptionImage.startsWith('http')) {
            return prescription.prescriptionImage;
        }
        
        const imagePath = prescription.prescriptionImage.replace(/\\/g, '/');
        return `http://localhost:5001/${imagePath}`;
    };

    const imageUrl = getImageUrl();
    const isPending = prescription.status === 'Pending';

    // Status configuration for styling
    const getStatusConfig = () => {
        switch (prescription.status) {
            case 'Pending': 
                return { 
                    icon: <FileText className="size-4" />,
                    color: 'bg-amber-100 text-amber-800 border-amber-200',
                    badgeColor: 'bg-amber-500'
                };
            case 'Verified': 
                return { 
                    icon: <CheckCircle className="size-4" />,
                    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    badgeColor: 'bg-emerald-500'
                };
            case 'Rejected': 
                return { 
                    icon: <XCircle className="size-4" />,
                    color: 'bg-red-100 text-red-800 border-red-200',
                    badgeColor: 'bg-red-500'
                };
            default: 
                return { 
                    icon: <FileText className="size-4" />,
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    badgeColor: 'bg-gray-500'
                };
        }
    };

    const statusConfig = getStatusConfig();

    // Get verified by staff information
    const getVerifiedByInfo = () => {
        if (!prescription.verifiedBy) return null;
        
        if (typeof prescription.verifiedBy === 'object') {
            return prescription.verifiedBy.name || `Staff ID: ${prescription.verifiedBy._id}`;
        }
        
        return `Staff ID: ${prescription.verifiedBy}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-6xl max-h-[90vh] overflow-auto w-full border border-gray-100">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                                <FileText className="size-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">
                                    Prescription Details
                                </h3>
                                <p className="text-emerald-100">
                                    For {prescription.customer?.name || 'Customer'}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-white hover:text-emerald-100 transition-colors duration-200 p-2 hover:bg-white/10 rounded-xl"
                        >
                            <X className="size-6" />
                        </button>
                    </div>
                </div>
                
                <div className="p-8">
                    {/* Status and Reference */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className={`px-4 py-2 rounded-2xl text-sm font-semibold border-2 ${statusConfig.color} flex items-center gap-2`}>
                                {statusConfig.icon}
                                {prescription.status}
                            </div>
                            <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: statusConfig.badgeColor.replace('bg-', '') }}></div>
                        </div>
                        <div className="text-sm text-gray-500">
                            Reference: <span className="font-mono text-gray-700">{prescription._id?.slice(-8)}</span>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Prescription Image Section */}
                        <div className="space-y-6">
                            <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                                <FileText className="size-6 text-emerald-600" />
                                Prescription Image
                            </h4>
                            
                            {imageUrl ? (
                                <div className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
                                    <img 
                                        src={imageUrl} 
                                        alt={`Prescription for ${prescription.customer?.name || 'Customer'}`}
                                        className="w-full h-auto max-h-[500px] object-contain"
                                        onError={(e) => {
                                            console.error('Failed to load image:', imageUrl);
                                            e.target.style.display = 'none';
                                            const fallback = document.getElementById(`fallback-${prescription._id}`);
                                            if (fallback) fallback.style.display = 'block';
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                                    <FileText className="size-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 text-xl">No prescription image available</p>
                                </div>
                            )}
                            
                            {/* Image Load Fallback */}
                            <div 
                                id={`fallback-${prescription._id}`}
                                className="hidden text-center py-12 bg-gray-100 rounded-2xl border border-gray-200"
                                style={{display: 'none'}}
                            >
                                <AlertCircle className="size-12 text-amber-500 mx-auto mb-4" />
                                <p className="text-gray-500 text-xl">Failed to load prescription image</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Please check the image path and try again
                                </p>
                            </div>
                        </div>

                        {/* Customer and Details Section */}
                        <div className="space-y-6">
                            {/* Customer Information */}
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                                <h4 className="font-semibold text-emerald-800 text-lg mb-4 flex items-center gap-3">
                                    <User className="size-5" />
                                    Customer Information
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white border border-emerald-200 rounded-xl flex items-center justify-center">
                                            <User className="size-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-emerald-600">Full Name</p>
                                            <p className="font-semibold text-emerald-800">
                                                {prescription.customer?.name || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white border border-emerald-200 rounded-xl flex items-center justify-center">
                                            <Mail className="size-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-emerald-600">Email Address</p>
                                            <p className="font-semibold text-emerald-800">
                                                {prescription.customer?.email || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white border border-emerald-200 rounded-xl flex items-center justify-center">
                                            <Phone className="size-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-emerald-600">Phone Number</p>
                                            <p className="font-semibold text-emerald-800">
                                                {prescription.customer?.phone || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white border border-emerald-200 rounded-xl flex items-center justify-center">
                                            <Calendar className="size-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-emerald-600">Upload Date</p>
                                            <p className="font-semibold text-emerald-800">
                                                {new Date(prescription.createdAt).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Notes */}
                            {prescription.notes && (
                                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                                    <h4 className="font-semibold text-blue-800 text-lg mb-3 flex items-center gap-3">
                                        <FileText className="size-5" />
                                        Customer Notes
                                    </h4>
                                    <p className="text-blue-700 leading-relaxed">{prescription.notes}</p>
                                </div>
                            )}

                            {/* Products Information */}
                            {prescription.products && prescription.products.length > 0 && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                                    <h4 className="font-semibold text-emerald-800 text-lg mb-4 flex items-center gap-3">
                                        <Package className="size-5" />
                                        Prescribed Products
                                        <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
                                            {prescription.products.length}
                                        </span>
                                    </h4>
                                    <div className="space-y-4">
                                        {prescription.products.map((product, index) => (
                                            <div key={index} className="bg-white rounded-xl p-4 border border-emerald-100 hover:shadow-md transition-all duration-200">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-gray-800 text-lg">
                                                            {product.productId?.name || 'Product'}
                                                        </div>
                                                        {product.dosage && (
                                                            <div className="text-sm text-gray-600 mt-1">💊 {product.dosage}</div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold text-gray-800">
                                                            Qty: {product.quantity}
                                                        </div>
                                                        {product.productId?.retailPrice && (
                                                            <div className="text-lg font-bold text-emerald-600 mt-1">
                                                                LKR {(product.productId.retailPrice * product.quantity).toFixed(2)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {product.productId?.retailPrice && (
                                                    <div className="text-sm text-gray-500">
                                                        Unit price: LKR {product.productId.retailPrice.toFixed(2)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {prescription.totalAmount > 0 && (
                                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-emerald-200">
                                            <strong className="text-emerald-800 text-xl">Total Amount:</strong>
                                            <strong className="text-emerald-800 text-2xl">LKR {prescription.totalAmount.toFixed(2)}</strong>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Verification Details */}
                            {!isPending && prescription.verifiedBy && (
                                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                                    <h4 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-3">
                                        <CheckCircle className="size-5 text-emerald-600" />
                                        Verification Details
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <User className="size-4 text-gray-600" />
                                            <span className="text-gray-700 font-medium">Verified By:</span>
                                            <span className="text-gray-800">{getVerifiedByInfo()}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="size-4 text-gray-600" />
                                            <span className="text-gray-700 font-medium">Verified At:</span>
                                            <span className="text-gray-800">
                                                {prescription.verifiedAt ? new Date(prescription.verifiedAt).toLocaleString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons for Staff */}
                    {isPending && onVerify && onReject && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <AlertCircle className="size-6 text-amber-500" />
                                Prescription Actions
                            </h4>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => onVerify(prescription)}
                                    className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                                >
                                    <CheckCircle className="size-6" />
                                    Verify Prescription
                                </button>
                                <button
                                    onClick={() => onReject(prescription)}
                                    className="flex-1 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                                >
                                    <XCircle className="size-6" />
                                    Reject Prescription
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrescriptionModal;