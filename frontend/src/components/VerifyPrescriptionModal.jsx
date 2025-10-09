import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Search, Plus, Minus } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const VerifyPrescriptionModal = ({ prescription, isOpen, onClose, onSuccess }) => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen]);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addProduct = (product) => {
        const existingProduct = selectedProducts.find(p => p.productId === product._id);
        if (existingProduct) {
            setSelectedProducts(prev =>
                prev.map(p =>
                    p.productId === product._id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                )
            );
        } else {
            setSelectedProducts(prev => [
                ...prev,
                {
                    productId: product._id,
                    productName: product.name,
                    quantity: 1,
                    retailPrice: product.retailPrice,
                    dosage: ''
                }
            ]);
        }
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeProduct(productId);
            return;
        }
        setSelectedProducts(prev =>
            prev.map(p =>
                p.productId === productId
                    ? { ...p, quantity: newQuantity }
                    : p
            )
        );
    };

    const removeProduct = (productId) => {
        setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
    };

    const updateDosage = (productId, dosage) => {
        setSelectedProducts(prev =>
            prev.map(p =>
                p.productId === productId
                    ? { ...p, dosage }
                    : p
            )
        );
    };

    const calculateTotal = () => {
        return selectedProducts.reduce((total, item) => {
            return total + (item.retailPrice * item.quantity);
        }, 0);
    };

    const handleSubmit = async () => {
        if (selectedProducts.length === 0) {
            toast.error('Please add at least one product');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put(`/prescriptions/${prescription._id}/verify`, {
                products: selectedProducts.map(p => ({
                    productId: p.productId,
                    quantity: p.quantity,
                    dosage: p.dosage
                })),
                notes
            });

            toast.success('Prescription verified successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error verifying prescription:', error);
            toast.error(error.response?.data?.message || 'Failed to verify prescription');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl max-h-full overflow-auto w-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800">
                        Verify Prescription - {prescription.customerName}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2"
                    >
                        <X className="size-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Product Selection */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Add Products</h4>
                            
                            {/* Search */}
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="input input-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 pr-12"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                            </div>

                            {/* Product List */}
                            <div className="border border-gray-200 rounded-xl max-h-96 overflow-y-auto">
                                {isLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : filteredProducts.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No products found
                                    </div>
                                ) : (
                                    filteredProducts.map(product => (
                                        <div key={product._id} className="flex justify-between items-center p-4 border-b border-gray-100 hover:bg-gray-50">
                                            <div>
                                                <div className="font-semibold text-gray-800">{product.name}</div>
                                                <div className="text-sm text-gray-600">LKR {product.retailPrice?.toFixed(2)}</div>
                                            </div>
                                            <button
                                                onClick={() => addProduct(product)}
                                                className="btn btn-sm bg-blue-600 text-white border-none hover:bg-blue-700"
                                            >
                                                <Plus className="size-4" />
                                                Add
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Selected Products */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Selected Products</h4>
                            
                            {selectedProducts.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
                                    No products selected
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {selectedProducts.map(item => (
                                        <div key={item.productId} className="border border-gray-200 rounded-xl p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-800">{item.productName}</div>
                                                    <div className="text-sm text-gray-600">LKR {item.retailPrice?.toFixed(2)} each</div>
                                                </div>
                                                <button
                                                    onClick={() => removeProduct(item.productId)}
                                                    className="btn btn-sm btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <X className="size-4" />
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                            className="btn btn-sm btn-square btn-ghost"
                                                        >
                                                            <Minus className="size-4" />
                                                        </button>
                                                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                            className="btn btn-sm btn-square btn-ghost"
                                                        >
                                                            <Plus className="size-4" />
                                                        </button>
                                                    </div>
                                                    <div className="text-sm text-gray-600 ml-auto">
                                                        LKR {(item.retailPrice * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Dosage Instructions:</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., 1 tablet twice daily"
                                                        className="input input-sm w-full border border-gray-300"
                                                        value={item.dosage}
                                                        onChange={(e) => updateDosage(item.productId, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Total and Notes */}
                            {selectedProducts.length > 0 && (
                                <div className="mt-6 space-y-4">
                                    <div className="flex justify-between items-center text-lg font-semibold text-gray-800 border-t pt-4">
                                        <span>Total Amount:</span>
                                        <span>LKR {calculateTotal().toFixed(2)}</span>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Additional Notes:</label>
                                        <textarea
                                            className="textarea w-full border border-gray-300"
                                            rows="3"
                                            placeholder="Any additional notes for the customer..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="btn border-2 border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 px-8"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={selectedProducts.length === 0 || isSubmitting}
                            className="btn bg-gradient-to-r from-green-500 to-green-600 border-none text-white hover:from-green-600 hover:to-green-700 px-8 gap-2"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <CheckCircle className="size-5" />
                            )}
                            {isSubmitting ? 'Verifying...' : 'Verify Prescription'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyPrescriptionModal;