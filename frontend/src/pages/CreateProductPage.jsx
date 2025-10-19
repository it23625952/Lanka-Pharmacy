import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Plus, Image, Package, DollarSign, FileText, ArrowLeft, Save, X, Calendar, AlertTriangle, Upload, Trash2 } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router';

const CreateProductPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        retailPrice: '',
        wholesalePrice: '',
        description: '',
        category: '',
        stock: '',
        imageUrl: '',
        expiryDate: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const navigate = useNavigate();

    // Product categories
    const categories = [
        'Prescription Medications',
        'Over-the-Counter',
        'Wellness & Supplements',
        'Personal Care',
        'Medical Supplies',
        'Baby Care',
        'First Aid',
        'Beauty Products',
        'Healthcare Devices'
    ];

    /**
     * Handles form input changes
     * @param {string} field - The field name to update
     * @param {string} value - The new value for the field
     */
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    /**
     * Handles file selection for image upload
     * @param {Event} e - File input change event
     */
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
            return;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setSelectedFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);

        // Clear URL input when file is selected
        setFormData(prev => ({ ...prev, imageUrl: '' }));
    };

    /**
     * Removes selected file and clears preview
     */
    const handleRemoveFile = () => {
        setSelectedFile(null);
        setImagePreview('');
        setUploadProgress(0);
    };

    /**
     * Handles image URL input and generates preview
     * @param {string} url - The image URL
     */
    const handleImageUrlChange = (url) => {
        setFormData(prev => ({ ...prev, imageUrl: url }));
        if (url) {
            setImagePreview(url);
            // Clear file selection when URL is entered
            setSelectedFile(null);
            setUploadProgress(0);
        }
    };

    /**
     * Uploads image file to server
     * @returns {Promise<string>} The uploaded image URL
     */
    const uploadImageFile = async () => {
        if (!selectedFile) return null;

        const uploadData = new FormData();
        uploadData.append('productImage', selectedFile);

        try {
            console.log('Starting image upload...', selectedFile.name);
            
            const response = await api.post('/products/upload-image', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(progress);
                }
            });

            console.log('Image upload successful:', response.data);
            toast.success('Image uploaded successfully!');
            return response.data.imageUrl;
        } catch (error) {
            console.error('Image upload error details:', error);
            
            // More detailed error handling
            if (error.code === 'ERR_NETWORK') {
                toast.error('Cannot connect to server. Please check if the backend is running.');
            } else if (error.response) {
                // Server responded with error status
                toast.error(error.response.data?.message || 'Failed to upload image');
            } else {
                toast.error('Failed to upload image. Please try again.');
            }
            throw error;
        }
    };

    /**
     * Validates the form data before submission
     * @returns {boolean} True if form is valid
     */
    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error('Product name is required');
            return false;
        }
        if (!formData.retailPrice || parseFloat(formData.retailPrice) <= 0) {
            toast.error('Valid retail price is required');
            return false;
        }
        if (!formData.wholesalePrice || parseFloat(formData.wholesalePrice) <= 0) {
            toast.error('Valid wholesale price is required');
            return false;
        }
        if (parseFloat(formData.wholesalePrice) >= parseFloat(formData.retailPrice)) {
            toast.error('Wholesale price must be less than retail price');
            return false;
        }
        if (!formData.description.trim()) {
            toast.error('Product description is required');
            return false;
        }
        if (!formData.category) {
            toast.error('Please select a category');
            return false;
        }
        if (formData.stock === '' || parseInt(formData.stock) < 0) {
            toast.error('Valid stock quantity is required');
            return false;
        }
        if (!formData.expiryDate) {
            toast.error('Expiry date is required');
            return false;
        }
        
        // Validate expiry date is not in the past
        const today = new Date();
        const expiry = new Date(formData.expiryDate);
        if (expiry < today) {
            toast.error('Expiry date cannot be in the past');
            return false;
        }

        // Validate that either image file or URL is provided
        if (!selectedFile && !formData.imageUrl.trim()) {
            toast.error('Please either upload an image or provide an image URL');
            return false;
        }

        return true;
    };

    /**
     * Checks if product will trigger low stock notification
     * @returns {boolean} True if stock is below 10
     */
    const isLowStock = () => {
        return parseInt(formData.stock) < 10;
    };

    /**
     * Checks if product will trigger expiry notification
     * @returns {boolean} True if expiry is within 30 days
     */
    const isNearExpiry = () => {
        if (!formData.expiryDate) return false;
        
        const today = new Date();
        const expiry = new Date(formData.expiryDate);
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        
        return daysUntilExpiry <= 30;
    };

    /**
     * Handles form submission for creating a new product
     * @param {Event} e - Form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            let finalImageUrl = formData.imageUrl;

            // Upload file if selected
            if (selectedFile) {
                console.log('Uploading selected file...');
                finalImageUrl = await uploadImageFile();
                if (!finalImageUrl) {
                    throw new Error('Image upload failed - no URL returned');
                }
                console.log('File uploaded, URL:', finalImageUrl);
            } else if (formData.imageUrl) {
                console.log('Using provided image URL:', formData.imageUrl);
            }

            const productData = {
                ...formData,
                retailPrice: parseFloat(formData.retailPrice),
                wholesalePrice: parseFloat(formData.wholesalePrice),
                stock: parseInt(formData.stock),
                expiryDate: new Date(formData.expiryDate).toISOString(),
                imageUrl: finalImageUrl
            };

            console.log('Submitting product data:', productData);

            const response = await api.post('/products', productData);
            
            console.log('Product created successfully:', response.data);
            
            // Check for notifications
            const notifications = [];
            if (isLowStock()) {
                notifications.push('low stock');
            }
            if (isNearExpiry()) {
                notifications.push('near expiry');
            }
            
            if (notifications.length > 0) {
                toast.success(`Product created successfully! ⚠️ Managers notified about ${notifications.join(' and ')}.`);
            } else {
                toast.success('Product created successfully!');
            }
            
            navigate('/'); // Redirect to home or products list
        } catch (error) {
            console.error('Error creating product details:', error);
            
            if (error.response?.status === 401) {
                toast.error('Please sign in to create products');
                navigate('/signin');
            } else if (error.response?.status === 403) {
                toast.error('You do not have permission to create products');
            } else if (error.code === 'ERR_NETWORK') {
                toast.error('Cannot connect to server. Please check if the backend is running on port 5001.');
            } else {
                toast.error(error.response?.data?.message || 'Failed to create product');
            }
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    /**
     * Clears the form and resets to initial state
     */
    const handleClearForm = () => {
        setFormData({
            name: '',
            retailPrice: '',
            wholesalePrice: '',
            description: '',
            category: '',
            stock: '',
            imageUrl: '',
            expiryDate: ''
        });
        setImagePreview('');
        setSelectedFile(null);
        setUploadProgress(0);
        toast.success('Form cleared');
    };

    /**
     * Calculates days until expiry for display
     * @returns {number} Days until expiry
     */
    const getDaysUntilExpiry = () => {
        if (!formData.expiryDate) return null;
        
        const today = new Date();
        const expiry = new Date(formData.expiryDate);
        return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    };

    const daysUntilExpiry = getDaysUntilExpiry();
    const showLowStockWarning = isLowStock();
    const showExpiryWarning = isNearExpiry();

    return (
        <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
            <Navbar />
            
            <div className='flex-1 container mx-auto px-4 py-8 max-w-4xl'>
                {/* Header Section */}
                <div className='flex items-center gap-4 mb-8'>
                    <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200">
                        <ArrowLeft className="size-5" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                </div>

                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-3'>
                        Add New Product
                    </h1>
                    <p className='text-gray-600 text-lg'>Create a new product for your pharmacy inventory</p>
                </div>

                {/* Product Creation Card */}
                <div className='bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100'>
                    {/* Header Section with Gradient Background */}
                    <div className='bg-gradient-to-br from-emerald-600 to-emerald-700 px-8 py-6'>
                        <div className="flex items-center gap-4">
                            <div className="inline-block bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-xl">
                                <Package className="size-8 text-white" />
                            </div>
                            <div>
                                <h2 className='text-2xl font-bold text-white'>Product Information</h2>
                                <p className='text-emerald-100'>Fill in the details to add a new product</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Form Section */}
                    <div className='p-8'>
                        <form onSubmit={handleSubmit} className='space-y-8'>
                            {/* Product Name */}
                            <div className='form-control'>
                                <label className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-3'>
                                    <Package className="size-5 text-emerald-600" />
                                    Product Name *
                                </label>
                                <input 
                                    type='text' 
                                    placeholder='Enter product name (e.g., Paracetamol 500mg Tablets)' 
                                    className='input input-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 text-gray-800 placeholder-gray-500'
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Pricing Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Retail Price */}
                                <div className='form-control'>
                                    <label className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-3'>
                                        <DollarSign className="size-5 text-green-600" />
                                        Retail Price (LKR) *
                                    </label>
                                    <input 
                                        type='number' 
                                        step='0.01'
                                        min='0'
                                        placeholder='0.00'
                                        className='input input-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 text-gray-800 placeholder-gray-500'
                                        value={formData.retailPrice}
                                        onChange={(e) => handleInputChange('retailPrice', e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Wholesale Price */}
                                <div className='form-control'>
                                    <label className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-3'>
                                        <DollarSign className="size-5 text-blue-600" />
                                        Wholesale Price (LKR) *
                                    </label>
                                    <input 
                                        type='number' 
                                        step='0.01'
                                        min='0'
                                        placeholder='0.00'
                                        className='input input-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 text-gray-800 placeholder-gray-500'
                                        value={formData.wholesalePrice}
                                        onChange={(e) => handleInputChange('wholesalePrice', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Price Comparison Note */}
                            {formData.retailPrice && formData.wholesalePrice && (
                                <div className={`p-4 rounded-xl border-2 ${
                                    parseFloat(formData.wholesalePrice) < parseFloat(formData.retailPrice)
                                        ? 'bg-green-50 border-green-200 text-green-700'
                                        : 'bg-red-50 border-red-200 text-red-700'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="size-4" />
                                        <span className="font-medium">
                                            {parseFloat(formData.wholesalePrice) < parseFloat(formData.retailPrice)
                                                ? `✓ Wholesale price is ${((1 - parseFloat(formData.wholesalePrice) / parseFloat(formData.retailPrice)) * 100).toFixed(1)}% lower than retail`
                                                : '⚠️ Wholesale price should be lower than retail price'
                                            }
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Category, Stock, and Expiry */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Category */}
                                <div className='form-control'>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        Category *
                                    </label>
                                    <select 
                                        className='select select-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 text-gray-800'
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Stock Quantity */}
                                <div className='form-control'>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        Stock Quantity *
                                    </label>
                                    <input 
                                        type='number' 
                                        min='0'
                                        placeholder='0'
                                        className={`input input-lg w-full border-2 rounded-xl focus:ring-4 transition-all duration-200 text-gray-800 placeholder-gray-500 ${
                                            showLowStockWarning
                                                ? 'border-orange-300 bg-orange-50 focus:border-orange-500 focus:ring-orange-100'
                                                : 'border-gray-300 bg-gray-50 focus:border-emerald-500 focus:ring-emerald-100'
                                        }`}
                                        value={formData.stock}
                                        onChange={(e) => handleInputChange('stock', e.target.value)}
                                        required
                                    />
                                    {showLowStockWarning && (
                                        <div className="flex items-center gap-2 mt-2 text-orange-600 text-sm">
                                            <AlertTriangle className="size-4" />
                                            <span>Low stock! Managers will be notified.</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Description */}
                            <div className='form-control'>
                                <label className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-3'>
                                    <FileText className="size-5 text-emerald-600" />
                                    Product Description *
                                </label>
                                <textarea
                                    className='textarea textarea-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 text-gray-800 placeholder-gray-500'
                                    rows={4}
                                    placeholder='Describe the product, usage instructions, benefits, etc...'
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Image Upload Section */}
                            <div className='form-control'>
                                <label className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-3'>
                                    <Image className="size-5 text-emerald-600" />
                                    Product Image *
                                </label>
                                
                                {/* File Upload Option */}
                                <div className="space-y-4">
                                    {/* File Upload */}
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                                        <input
                                            type='file'
                                            className='hidden'
                                            id='productImage'
                                            accept='image/jpeg,image/jpg,image/png,image/webp'
                                            onChange={handleFileSelect}
                                        />
                                        
                                        {!selectedFile ? (
                                            <label htmlFor='productImage' className='cursor-pointer block text-center'>
                                                <Upload className='size-12 text-gray-400 mx-auto mb-3' />
                                                <p className='text-gray-600 text-lg mb-2'>Click to upload product image</p>
                                                <p className='text-sm text-gray-500'>Supports JPG, PNG, WebP (Max 5MB)</p>
                                            </label>
                                        ) : (
                                            <div className="text-center">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-gray-700 font-medium">
                                                        {selectedFile.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveFile}
                                                        className="btn btn-sm btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>
                                                
                                                {/* Upload Progress */}
                                                {uploadProgress > 0 && uploadProgress < 100 && (
                                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                                        <div 
                                                            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${uploadProgress}%` }}
                                                        ></div>
                                                    </div>
                                                )}
                                                
                                                <label 
                                                    htmlFor='productImage'
                                                    className='btn border-2 border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50 px-4 py-2 transition-all duration-200'
                                                >
                                                    Change Image
                                                </label>
                                            </div>
                                        )}
                                    </div>

                                    {/* OR Separator */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">OR</span>
                                        </div>
                                    </div>

                                    {/* Image URL Option */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Enter Image URL
                                        </label>
                                        <input 
                                            type='url' 
                                            placeholder='https://example.com/product-image.jpg'
                                            className='input input-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 text-gray-800 placeholder-gray-500'
                                            value={formData.imageUrl}
                                            onChange={(e) => handleImageUrlChange(e.target.value)}
                                            disabled={!!selectedFile}
                                        />
                                    </div>
                                </div>
                                
                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mt-4">
                                        <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                            Image Preview
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                                            <img 
                                                src={imagePreview} 
                                                alt="Product preview" 
                                                className="max-h-48 mx-auto rounded-lg shadow-md"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    toast.error('Failed to load image');
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <button 
                                    type="button"
                                    onClick={handleClearForm}
                                    className="btn border-2 border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 flex-1 py-4 text-lg transition-all duration-200 flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    <X className="size-5" />
                                    Clear Form
                                </button>
                                <button 
                                    type="submit"
                                    className="btn bg-gradient-to-r from-emerald-600 to-emerald-700 border-none text-white hover:from-emerald-700 hover:to-emerald-800 flex-1 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Creating Product...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="size-5" />
                                            <span>Create Product</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Help Information */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <h3 className="font-semibold text-blue-800 text-lg mb-3">📝 Product Creation Tips</h3>
                    <ul className="text-blue-700 space-y-2 text-sm">
                        <li>• Use clear, descriptive product names that customers will understand</li>
                        <li>• Wholesale price should always be lower than retail price</li>
                        <li>• Include detailed descriptions with usage instructions when applicable</li>
                        <li>• Choose the most relevant category for better organization</li>
                        <li>• Update stock quantities regularly to maintain accurate inventory</li>
                        <li>• Upload high-quality images (JPEG, PNG, WebP) under 5MB for best results</li>
                        <li>• <strong>Expiry dates are critical</strong> for pharmacy products - always set accurate dates</li>
                        <li>• Managers receive automatic notifications for low stock (&lt;10) and near-expiry (&lt;30 days) items</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateProductPage;