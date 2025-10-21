import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Search, Plus, Minus, FileText, Package, User, Image as ImageIcon } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const VerifyPrescriptionModal = ({ prescription, isOpen, onClose, onSuccess }) => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notes, setNotes] = useState('');
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (isOpen && prescription) {
            fetchProducts();
            setImageError(false);
        }
    }, [isOpen, prescription]);

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

    // Use the same image URL construction as PrescriptionModal with null checks
    const getImageUrl = () => {
        if (!prescription || !prescription.prescriptionImage) return null;
        
        if (prescription.prescriptionImage.startsWith('http')) {
            return prescription.prescriptionImage;
        }
        
        const imagePath = prescription.prescriptionImage.replace(/\\/g, '/');
        return `http://localhost:5001/${imagePath}`;
    };

    const imageUrl = getImageUrl();

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
            // Debug: Log the prescription ID and endpoint
            console.log('Prescription ID:', prescription._id);
            console.log('Selected products:', selectedProducts);
            
            // Make sure the endpoint matches your backend route
            const response = await api.put(`/prescriptions/${prescription._id}/verify`, {
                products: selectedProducts.map(p => ({
                    productId: p.productId,
                    quantity: p.quantity,
                    dosage: p.dosage
                })),
                notes
            });

            console.log('Verification response:', response.data);
            toast.success('Prescription verified successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error verifying prescription:', error);
            console.error('Error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                url: error.config?.url
            });
            
            if (error.response?.status === 404) {
                toast.error('Verification endpoint not found. Please check the API route.');
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to verify prescription. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    // Don't render if not open or prescription is null
    if (!isOpen || !prescription) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-7xl max-h-[90vh] overflow-auto w-full border border-gray-100">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                                <CheckCircle className="size-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Verify Prescription</h3>
                                <p className="text-emerald-100">
                                    Processing prescription for {prescription.customer?.name || prescription.customerName || 'Customer'}
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
                    {/* Prescription Information */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8">
                        <h4 className="font-semibold text-emerald-800 text-lg mb-4 flex items-center gap-3">
                            <FileText className="size-5" />
                            Prescription Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-emerald-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white border border-emerald-200 rounded-xl flex items-center justify-center">
                                    <User className="size-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-emerald-600">Customer</p>
                                    <p className="font-semibold">
                                        {prescription.customer?.name || prescription.customerName || 'Not provided'}
                                    </p>
                                </div>
                            </div>
                            {prescription.doctorName && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white border border-emerald-200 rounded-xl flex items-center justify-center">
                                        <FileText className="size-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-emerald-600">Prescribed By</p>
                                        <p className="font-semibold">{prescription.doctorName}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white border border-emerald-200 rounded-xl flex items-center justify-center">
                                    <Package className="size-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-emerald-600">Reference ID</p>
                                    <p className="font-mono font-semibold text-sm">
                                        {prescription._id ? prescription._id.slice(-8) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Prescription Image Panel - Always Visible */}
                        <div className="space-y-6">
                            <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                                <ImageIcon className="size-6 text-emerald-600" />
                                Prescription Image
                            </h4>
                            
                            {imageUrl && !imageError ? (
                                <div className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
                                    <img 
                                        src={imageUrl} 
                                        alt={`Prescription for ${prescription.customer?.name || prescription.customerName || 'Customer'}`}
                                        className="w-full h-auto max-h-[400px] object-contain"
                                        onError={handleImageError}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                                    <ImageIcon className="size-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No prescription image available</p>
                                </div>
                            )}
                            
                            {/* Image Information */}
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="size-5 text-blue-600" />
                                    <div>
                                        <p className="text-blue-800 font-medium text-sm">Reference this image</p>
                                        <p className="text-blue-700 text-sm">While adding products to match the prescribed medications</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Selection Panel */}
                        <div className="space-y-6">
                            <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                                <Package className="size-6 text-emerald-600" />
                                Add Products
                            </h4>
                            
                            {/* Search Input */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Search className="size-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search products by name..."
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Product List */}
                            <div className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-white">
                                {isLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : filteredProducts.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Package className="size-12 text-gray-400 mx-auto mb-4" />
                                        <p>No products found</p>
                                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms</p>
                                    </div>
                                ) : (
                                    <div className="max-h-96 overflow-y-auto">
                                        {filteredProducts.map(product => (
                                            <div key={product._id} className="flex justify-between items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-800 text-lg">{product.name}</div>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                                            LKR {product.retailPrice?.toFixed(2)}
                                                        </span>
                                                        {product.stockQuantity !== undefined && (
                                                            <span className={`text-sm px-2 py-1 rounded-full ${
                                                                product.stockQuantity > 10 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : product.stockQuantity > 0
                                                                    ? 'bg-amber-100 text-amber-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                Stock: {product.stockQuantity}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => addProduct(product)}
                                                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                                                >
                                                    <Plus className="size-4" />
                                                    Add
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Selected Products Panel */}
                        <div className="space-y-6">
                            <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                                <CheckCircle className="size-6 text-emerald-600" />
                                Selected Products
                                {selectedProducts.length > 0 && (
                                    <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {selectedProducts.length}
                                    </span>
                                )}
                            </h4>
                            
                            {selectedProducts.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                                    <Package className="size-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-lg text-gray-600">No products selected</p>
                                    <p className="text-sm text-gray-400 mt-1">Add products from the middle panel</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {selectedProducts.map(item => (
                                        <div key={item.productId} className="border-2 border-gray-200 rounded-2xl p-6 bg-white hover:shadow-lg transition-all duration-200">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-800 text-lg">{item.productName}</div>
                                                    <div className="text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                                                        LKR {item.retailPrice?.toFixed(2)} each
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeProduct(item.productId)}
                                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                >
                                                    <X className="size-5" />
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                            className="w-10 h-10 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-all duration-200"
                                                        >
                                                            <Minus className="size-4" />
                                                        </button>
                                                        <span className="w-12 text-center font-semibold text-lg text-gray-800">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                            className="w-10 h-10 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-all duration-200"
                                                        >
                                                            <Plus className="size-4" />
                                                        </button>
                                                    </div>
                                                    <div className="text-lg font-bold text-emerald-600">
                                                        LKR {(item.retailPrice * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                        <FileText className="size-4" />
                                                        Dosage Instructions:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., 1 tablet twice daily after meals"
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
                                                        value={item.dosage}
                                                        onChange={(e) => updateDosage(item.productId, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Total and Notes Section */}
                            {selectedProducts.length > 0 && (
                                <div className="space-y-6 mt-6">
                                    <div className="flex justify-between items-center text-xl font-bold text-gray-800 border-t border-gray-200 pt-6">
                                        <span>Total Amount:</span>
                                        <span className="text-2xl text-emerald-600">LKR {calculateTotal().toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <label className="text-lg font-semibold text-gray-700 flex items-center gap-3">
                                            <FileText className="size-5 text-emerald-600" />
                                            Additional Notes for Customer
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none"
                                                rows="3"
                                                placeholder="Any additional instructions, storage information, or notes for the customer..."
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                            />
                                            <div className="absolute left-4 top-4 text-gray-400">
                                                <FileText className="size-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-8 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-8 py-4 border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                            disabled={isSubmitting}
                        >
                            <X className="size-5" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={selectedProducts.length === 0 || isSubmitting}
                            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Verifying Prescription...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="size-5" />
                                    <span>Verify Prescription</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyPrescriptionModal;