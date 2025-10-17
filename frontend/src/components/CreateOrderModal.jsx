import React, { useState } from 'react';
import { X, ShoppingCart, CreditCard, Wallet, Truck, Building, MapPin, FileText } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const CreateOrderModal = ({ prescription, isOpen, onClose, onSuccess }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        paymentMethod: 'Cash on Delivery',
        shippingAddress: '',
        notes: ''
    });

    const paymentMethods = [
        { value: 'Cash on Delivery', label: 'Cash on Delivery', icon: Truck, description: 'Pay when you receive your order' },
        { value: 'Card Payment', label: 'Credit/Debit Card', icon: CreditCard, description: 'Secure online payment' },
        { value: 'Digital Wallet', label: 'Digital Wallet', icon: Wallet, description: 'Quick digital payment' },
        { value: 'Bank Transfer', label: 'Bank Transfer', icon: Building, description: 'Direct bank transfer' }
    ];

    const calculateTotal = () => {
        if (!prescription?.products) return 0;
        return prescription.products.reduce((total, item) => {
            const price = item.productId?.retailPrice || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCreateOrder = async () => {
        if (!formData.shippingAddress.trim()) {
            toast.error('Please enter a shipping address');
            return;
        }

        setIsCreating(true);
        try {
            console.log('=== CREATING ORDER FROM PRESCRIPTION ===');
            console.log('Prescription:', prescription);
            console.log('Shipping address:', formData.shippingAddress);
            console.log('Payment method:', formData.paymentMethod);
            
            const response = await api.post('/orders/create-from-prescription', {
                prescriptionId: prescription._id,
                shippingAddress: formData.shippingAddress, // Changed from deliveryAddress to shippingAddress
                paymentMethod: formData.paymentMethod,
                notes: formData.notes
            });

            console.log('Order creation response:', response.data);
            toast.success('Order created successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating order:', error);
            console.error('Error response data:', error.response?.data);
            console.error('Error config:', error.config);
            
            if (error.response?.status === 500) {
                toast.error('Server error while creating order. Please check backend logs.');
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to create order. Please try again.');
            }
        } finally {
            setIsCreating(false);
        }
    };

    if (!isOpen || !prescription) return null;

    const totalAmount = calculateTotal();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl max-h-[90vh] overflow-auto w-full border border-gray-100">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                                <ShoppingCart className="size-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">
                                    Create Order
                                </h3>
                                <p className="text-emerald-100 text-sm">From verified prescription</p>
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
                    {/* Prescription Summary */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8">
                        <h4 className="font-semibold text-emerald-800 text-lg mb-4 flex items-center gap-3">
                            <FileText className="size-5" />
                            Prescription Summary
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-emerald-700">
                            <div>
                                <p className="font-medium">Customer</p>
                                <p className="text-lg font-semibold">{prescription.customer?.name}</p>
                            </div>
                            <div>
                                <p className="font-medium">Reference ID</p>
                                <p className="text-sm font-mono">{prescription._id}</p>
                            </div>
                            <div>
                                <p className="font-medium">Total Items</p>
                                <p className="text-lg font-semibold">{prescription.products?.length || 0}</p>
                            </div>
                            <div>
                                <p className="font-medium">Prescribed By</p>
                                <p className="text-sm">{prescription.doctorName || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                        <h4 className="font-semibold text-gray-800 text-lg mb-4">Order Items</h4>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {prescription.products?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all duration-200">
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-800 text-lg">
                                            {item.productId?.name || 'Product'}
                                        </div>
                                        {item.dosage && (
                                            <div className="text-sm text-gray-600 mt-1">💊 Dosage: {item.dosage}</div>
                                        )}
                                        {item.instructions && (
                                            <div className="text-sm text-gray-600 mt-1">📋 Instructions: {item.instructions}</div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-800">
                                            {item.quantity} x LKR {item.productId?.retailPrice?.toFixed(2) || '0.00'}
                                        </div>
                                        <div className="text-lg font-bold text-emerald-600 mt-1">
                                            LKR {((item.productId?.retailPrice || 0) * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="flex justify-between items-center mb-8 p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl border border-emerald-600">
                        <strong className="text-white text-xl">Total Amount:</strong>
                        <strong className="text-white text-2xl">LKR {totalAmount.toFixed(2)}</strong>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="mb-8">
                        <h4 className="font-semibold text-gray-800 text-lg mb-4">Payment Method</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {paymentMethods.map((method) => {
                                const IconComponent = method.icon;
                                return (
                                    <button
                                        key={method.value}
                                        onClick={() => handleInputChange('paymentMethod', method.value)}
                                        className={`p-4 border-2 rounded-2xl text-left transition-all duration-200 group ${
                                            formData.paymentMethod === method.value
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:shadow-md'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-xl ${
                                                formData.paymentMethod === method.value
                                                    ? 'bg-emerald-100 text-emerald-600'
                                                    : 'bg-gray-100 text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-500'
                                            }`}>
                                                <IconComponent className="size-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-base">{method.label}</div>
                                                <div className="text-sm text-gray-500 mt-1">{method.description}</div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-8">
                        <label className="font-semibold text-gray-800 text-lg mb-3 flex items-center gap-2">
                            <MapPin className="size-5 text-emerald-600" />
                            Shipping Address *
                        </label>
                        <div className="relative">
                            <textarea
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none"
                                rows="3"
                                placeholder="Enter your complete shipping address for delivery..."
                                value={formData.shippingAddress}
                                onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                            />
                            <div className="absolute left-4 top-4 text-gray-400">
                                <MapPin className="size-5" />
                            </div>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="mb-8">
                        <label className="font-semibold text-gray-800 text-lg mb-3 flex items-center gap-2">
                            <FileText className="size-5 text-emerald-600" />
                            Additional Notes
                        </label>
                        <div className="relative">
                            <textarea
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none"
                                rows="2"
                                placeholder="Any special delivery instructions or notes for the pharmacy..."
                                value={formData.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                            />
                            <div className="absolute left-4 top-4 text-gray-400">
                                <FileText className="size-5" />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            disabled={isCreating}
                            className="px-8 py-4 border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 flex-1"
                        >
                            <X className="size-5" />
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateOrder}
                            disabled={isCreating || !formData.shippingAddress.trim()}
                            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creating Order...</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="size-5" />
                                    <span>Create Order</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOrderModal;