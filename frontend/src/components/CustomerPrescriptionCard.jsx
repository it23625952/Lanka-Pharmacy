import { Eye, Clock, CheckCircle, XCircle, FileText, ShoppingCart, Trash2, Calendar, Hash, Tag } from 'lucide-react';
import React, { useState } from 'react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import DeletePrescriptionModal from './DeletePrescriptionModal';

const CustomerPrescriptionCard = ({ prescription, onSelect, onCreateOrder, onDelete, userRole }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    // Calculate total amount based on user role
    const calculateTotalAmount = () => {
        if (!prescription.products || prescription.products.length === 0) return 0;
        
        return prescription.products.reduce((total, item) => {
            let price = 0;
            
            // Use wholesale price for wholesale customers, retail for others
            if (userRole === 'Wholesale Customer' && item.productId?.wholesalePrice) {
                price = item.productId.wholesalePrice;
            } else if (item.productId?.retailPrice) {
                price = item.productId.retailPrice;
            }
            
            return total + (price * item.quantity);
        }, 0);
    };

    // Get price label based on role
    const getPriceLabel = () => {
        return userRole === 'Wholesale Customer' ? 'Wholesale Price' : 'Retail Price';
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

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!prescription._id) {
            toast.error('Cannot delete prescription: Invalid prescription ID');
            return;
        }

        setIsDeleting(true);
        try {
            await api.delete(`/prescriptions/${prescription._id}`);
            toast.success('Prescription deleted successfully');
            if (onDelete) {
                onDelete(prescription._id);
            }
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting prescription:', error);
            toast.error(error.response?.data?.message || 'Failed to delete prescription');
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    const totalAmount = calculateTotalAmount();
    const priceLabel = getPriceLabel();

    return (
        <>
            <div className='bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300'>
                <div className='p-8'>
                    <div className='flex justify-between items-start'>
                        <div className='space-y-6 flex-1'>
                            {/* Header Section */}
                            <div className='flex items-center gap-4'>
                                <div className="flex items-center gap-4">
                                    {getStatusIcon(prescription.status)}
                                    <h3 className='text-2xl font-bold text-gray-800'>Prescription #{prescription._id.slice(-6)}</h3>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(prescription.status)}`}>
                                    {prescription.status}
                                </span>
                            </div>

                            {/* Status Description */}
                            <p className="text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200 text-lg">
                                {getStatusDescription(prescription.status)}
                            </p>

                            {/* Prescription Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-600">
                                <div className="flex items-center gap-3">
                                    <Calendar className="size-5 text-emerald-600" />
                                    <span><strong>Uploaded:</strong> {new Date(prescription.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Hash className="size-5 text-emerald-600" />
                                    <span><strong>Reference ID:</strong> {prescription._id}</span>
                                </div>
                            </div>

                        {/* Price Information */}
                        {prescription.status === 'Verified' && prescription.products && prescription.products.length > 0 && (
                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Tag className="size-5 text-emerald-600" />
                                        <span className="font-semibold text-emerald-800">{priceLabel}:</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-emerald-700">
                                            LKR {totalAmount.toFixed(2)}
                                        </div>
                                        <div className="text-sm text-emerald-600">
                                            {userRole === 'Wholesale Customer' ? 'Wholesale rates applied' : 'Standard retail pricing'}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Product Breakdown */}
                                <div className="mt-3 space-y-2">
                                    {prescription.products.map((item, index) => {
                                        const itemPrice = userRole === 'Wholesale Customer' 
                                            ? (item.productId?.wholesalePrice || item.productId?.retailPrice || 0)
                                            : (item.productId?.retailPrice || 0);
                                        const itemTotal = itemPrice * item.quantity;
                                        
                                        return (
                                            <div key={index} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-700">
                                                    {item.productId?.name} × {item.quantity}
                                                </span>
                                                <span className="font-medium text-emerald-700">
                                                    LKR {itemTotal.toFixed(2)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                            {/* Verification Date */}
                            {prescription.verifiedAt && (
                                <div className="flex items-center gap-3 text-lg text-gray-600">
                                    <CheckCircle className="size-5 text-emerald-600" />
                                    <span><strong>Verified on:</strong> {new Date(prescription.verifiedAt).toLocaleDateString()}</span>
                                </div>
                            )}

                            {/* Order Status */}
                            {prescription.order && (
                                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-4 border-2 border-emerald-200">
                                    <div className="flex items-center gap-3">
                                        <ShoppingCart className="size-5 text-emerald-600" />
                                        <div>
                                            <strong className="text-emerald-700 text-lg">Order Created</strong>
                                            <p className="text-emerald-600 text-md mt-1">Order #{prescription.order.orderNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-col gap-4 ml-6'>
                            <button 
                                className='btn border-2 border-emerald-500 text-emerald-600 bg-transparent hover:bg-emerald-50 hover:border-emerald-600 gap-3 transition-all duration-300 flex items-center justify-center min-h-[52px] px-6 rounded-2xl font-semibold text-lg'
                                onClick={handleViewClick}
                            >
                                <Eye className='size-5' />
                                View Details
                            </button>

                            {/* Create Order Button */}
                            {onCreateOrder && prescription.status === 'Verified' && !prescription.order && prescription.status === 'Verified' && !prescription.order && (
                                <button 
                                    className='btn bg-gradient-to-r from-emerald-500 to-emerald-600 border-none text-white hover:from-emerald-600 hover:to-emerald-700 gap-3 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center min-h-[52px] px-6 rounded-2xl font-semibold text-lg'
                                    onClick={handleCreateOrderClick}
                                >
                                    <ShoppingCart className='size-5' />
                                    Create Order
                                </button>
                            )}

                            {/* Delete Button */}
                            {prescription.status === 'Pending' && (
                                <button 
                                    className='btn border-2 border-red-500 text-red-600 bg-transparent hover:bg-red-50 hover:border-red-600 gap-3 transition-all duration-300 flex items-center justify-center min-h-[52px] px-6 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed'
                                    onClick={handleDeleteClick}
                                    disabled={isDeleting}
                                >
                                    <Trash2 className='size-5' />
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notes Section */}
                    {prescription.notes && (
                        <div className='bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mt-6 border-2 border-blue-200'>
                            <div className="flex items-center gap-3 mb-3">
                                <FileText className="size-5 text-blue-600" />
                                <strong className="text-blue-700 text-lg">Notes:</strong>
                            </div>
                            <p className='text-blue-600 text-lg'>{prescription.notes}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeletePrescriptionModal
                prescription={prescription}
                isOpen={showDeleteModal}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </>
    );
};

export default CustomerPrescriptionCard;