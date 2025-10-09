import React, { useState } from 'react';
import { X, ShoppingCart, CreditCard, Wallet, Truck, Building } from 'lucide-react';
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
        { value: 'Cash on Delivery', label: 'Cash on Delivery', icon: Truck },
        { value: 'Card Payment', label: 'Credit/Debit Card', icon: CreditCard },
        { value: 'Digital Wallet', label: 'Digital Wallet', icon: Wallet },
        { value: 'Bank Transfer', label: 'Bank Transfer', icon: Building }
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
            toast.error('Please provide a shipping address');
            return;
        }

        setIsCreating(true);
        try {
            await api.post('/orders/create-from-prescription', {
                prescriptionId: prescription._id,
                ...formData
            });

            toast.success('Order created successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error(error.response?.data?.message || 'Failed to create order');
        } finally {
            setIsCreating(false);
        }
    };

    if (!isOpen || !prescription) return null;

    const totalAmount = calculateTotal();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl max-h-full overflow-auto w-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <ShoppingCart className="size-7 text-green-600" />
                        Create Order from Prescription
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2"
                    >
                        <X className="size-6" />
                    </button>
                </div>
                
                <div className="p-6">
                    {/* Prescription Summary */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <h4 className="font-semibold text-blue-800 text-lg mb-3">Prescription Summary</h4>
                        <div className="space-y-2 text-blue-700">
                            <p><strong>Customer:</strong> {prescription.customer?.name}</p>
                            <p><strong>Reference:</strong> {prescription._id}</p>
                            <p><strong>Total Items:</strong> {prescription.products?.length || 0}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-800 text-lg mb-3">Order Items</h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {prescription.products?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-800">
                                            {item.productId?.name || 'Product'}
                                        </div>
                                        {item.dosage && (
                                            <div className="text-sm text-gray-600">Dosage: {item.dosage}</div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-800">
                                            {item.quantity} x LKR {item.productId?.retailPrice?.toFixed(2) || '0.00'}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            LKR {((item.productId?.retailPrice || 0) * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="flex justify-between items-center mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
                        <strong className="text-green-800 text-lg">Total Amount:</strong>
                        <strong className="text-green-800 text-lg">LKR {totalAmount.toFixed(2)}</strong>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-800 text-lg mb-3">Payment Method</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {paymentMethods.map((method) => {
                                const IconComponent = method.icon;
                                return (
                                    <button
                                        key={method.value}
                                        onClick={() => handleInputChange('paymentMethod', method.value)}
                                        className={`p-3 border-2 rounded-xl text-left transition-all duration-200 ${
                                            formData.paymentMethod === method.value
                                                ? 'border-green-500 bg-green-50 text-green-700'
                                                : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400'
                                        }`}
                                    >
                                        <IconComponent className="size-5 mb-2" />
                                        <div className="font-medium text-sm">{method.label}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-6">
                        <label className="font-semibold text-gray-800 text-lg mb-2 block">
                            Shipping Address *
                        </label>
                        <textarea
                            className="textarea w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder-gray-500"
                            rows="3"
                            placeholder="Enter your complete shipping address..."
                            value={formData.shippingAddress}
                            onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                        />
                    </div>

                    {/* Additional Notes */}
                    <div className="mb-6">
                        <label className="font-semibold text-gray-800 text-lg mb-2 block">
                            Additional Notes
                        </label>
                        <textarea
                            className="textarea w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder-gray-500"
                            rows="2"
                            placeholder="Any special instructions..."
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="btn border-2 border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 flex-1 py-3"
                            disabled={isCreating}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateOrder}
                            disabled={isCreating || !formData.shippingAddress.trim()}
                            className="btn bg-gradient-to-r from-green-500 to-green-600 border-none text-white hover:from-green-600 hover:to-green-700 flex-1 py-3 gap-2 flex items-center justify-center"
                        >
                            {isCreating ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <ShoppingCart className="size-5" />
                            )}
                            {isCreating ? 'Creating Order...' : 'Create Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOrderModal;