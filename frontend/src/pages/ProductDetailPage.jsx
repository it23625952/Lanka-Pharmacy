import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useParams, useNavigate, Link } from 'react-router';
import { 
    ArrowLeft, 
    ShoppingCart, 
    Heart, 
    Share2, 
    Star, 
    Package, 
    Truck, 
    Shield, 
    RotateCcw,
    Plus,
    Minus,
    Check,
    AlertTriangle,
    Edit,
    Trash2
} from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAdminActions, setShowAdminActions] = useState(false); // Set based on user role

    // Mock related products (in real app, fetch from API)
    const relatedProducts = [
        {
            _id: '1',
            name: 'Similar Product 1',
            retailPrice: 1200,
            imageUrl: '/api/placeholder/300/300',
            category: 'Wellness & Supplements'
        },
        {
            _id: '2', 
            name: 'Similar Product 2',
            retailPrice: 850,
            imageUrl: '/api/placeholder/300/300',
            category: 'Personal Care'
        },
        {
            _id: '3',
            name: 'Similar Product 3', 
            retailPrice: 1500,
            imageUrl: '/api/placeholder/300/300',
            category: 'Healthcare Devices'
        }
    ];

    // Mock reviews (in real app, fetch from API)
    const reviews = [
        {
            id: 1,
            user: 'John D.',
            rating: 5,
            date: '2024-01-15',
            comment: 'Excellent product! Fast delivery and great quality.',
            verified: true
        },
        {
            id: 2,
            user: 'Sarah M.',
            rating: 4,
            date: '2024-01-10', 
            comment: 'Good value for money. Would recommend.',
            verified: true
        },
        {
            id: 3,
            user: 'Mike R.',
            rating: 5,
            date: '2024-01-08',
            comment: 'Exactly what I needed. Works perfectly!',
            verified: false
        }
    ];

    useEffect(() => {
        fetchProduct();
        // In real app, check user role from context/state
        setShowAdminActions(true); // Set this based on actual user role check
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product details');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;

        setAddingToCart(true);
        try {
            // In a real app, you'd call your cart API here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            
            toast.success(`Added ${quantity} ${product.name} to cart!`);
            
            // Reset quantity after adding to cart
            setQuantity(1);
        } catch (error) {
            toast.error('Failed to add product to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleAddToWishlist = () => {
        setIsInWishlist(!isInWishlist);
        toast.success(!isInWishlist ? 'Added to wishlist!' : 'Removed from wishlist');
    };

    const handleShareProduct = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Product link copied to clipboard!');
        }
    };

    const handleEditProduct = () => {
        navigate(`/edit-product/${id}`);
    };

    const handleDeleteProduct = async () => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await api.delete(`/products/${id}`);
            toast.success('Product deleted successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error deleting product:', error);
            
            if (error.response?.status === 401) {
                toast.error('Please sign in to delete products');
                navigate('/signin');
            } else if (error.response?.status === 403) {
                toast.error('You do not have permission to delete products');
            } else {
                toast.error(error.response?.data?.message || 'Failed to delete product');
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const increaseQuantity = () => {
        if (quantity < (product?.stock || 10)) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const getStockStatus = () => {
        if (!product?.stock) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
        if (product.stock < 10) return { text: `Only ${product.stock} left!`, color: 'text-orange-600', bg: 'bg-orange-100' };
        return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
    };

    const getExpiryStatus = () => {
        if (!product?.expiryDate) return null;
        
        const expiry = new Date(product.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 0) return { text: 'Expired', color: 'text-red-600', bg: 'bg-red-100' };
        if (daysUntilExpiry <= 30) return { text: `Expires in ${daysUntilExpiry} days`, color: 'text-orange-600', bg: 'bg-orange-100' };
        return { text: `Expires ${expiry.toLocaleDateString()}`, color: 'text-gray-600', bg: 'bg-gray-100' };
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`size-4 ${
                    index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
            />
        ));
    };

    // Function to get proper image URL
    const getImageUrl = (url) => {
        if (!url) return null;
        
        if (url.startsWith('http')) return url;
        
        if (url.startsWith('/')) {
            const backendUrl = window.location.origin.includes('localhost') 
                ? 'http://localhost:5001' 
                : window.location.origin;
            return `${backendUrl}${url}`;
        }
        
        return url;
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
                        <Link to="/" className="btn bg-emerald-600 text-white">Back to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    const stockStatus = getStockStatus();
    const expiryStatus = getExpiryStatus();
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    const finalImageUrl = getImageUrl(product.imageUrl);

    return (
        <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
            <Navbar />
            
            <div className='flex-1 container mx-auto px-4 py-8 max-w-7xl'>
                {/* Breadcrumb */}
                <div className='flex items-center gap-2 text-sm text-gray-600 mb-6'>
                    <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/" className="hover:text-emerald-600 transition-colors">Products</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium">{product.name}</span>
                </div>

                {/* Back Button */}
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                        <ArrowLeft className="size-5" />
                        <span>Back</span>
                    </button>

                    {/* Admin Actions */}
                    {showAdminActions && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleEditProduct}
                                className="btn border-2 border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50 gap-2 transition-all duration-200"
                            >
                                <Edit className="size-4" />
                                Edit Product
                            </button>
                            <button
                                onClick={handleDeleteProduct}
                                disabled={isDeleting}
                                className="btn border-2 border-red-500 text-red-600 bg-transparent hover:bg-red-50 gap-2 transition-all duration-200"
                            >
                                {isDeleting ? (
                                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Trash2 className="size-4" />
                                )}
                                {isDeleting ? 'Deleting...' : 'Delete Product'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <img 
                                src={finalImageUrl || '/api/placeholder/600/600'} 
                                alt={product.name}
                                className="w-full h-96 object-contain rounded-lg"
                                onError={(e) => {
                                    e.target.src = '/api/placeholder/600/600';
                                }}
                            />
                        </div>

                        {/* Image Thumbnails */}
                        <div className="flex gap-3 overflow-x-auto">
                            {[finalImageUrl, '/api/placeholder/300/300', '/api/placeholder/300/300'].map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                                        selectedImage === index ? 'border-emerald-500' : 'border-gray-200'
                                    }`}
                                >
                                    <img 
                                        src={img} 
                                        alt={`${product.name} view ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/api/placeholder/300/300';
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Category & Status */}
                        <div className="flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                {product.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                                {stockStatus.text}
                            </span>
                            {expiryStatus && (
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${expiryStatus.bg} ${expiryStatus.color}`}>
                                    {expiryStatus.text}
                                </span>
                            )}
                        </div>

                        {/* Product Name */}
                        <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                {renderStars(Math.round(averageRating))}
                                <span className="text-gray-600 ml-2">{averageRating.toFixed(1)}</span>
                            </div>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-600">{reviews.length} reviews</span>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="text-4xl font-bold text-emerald-600">
                                LKR {product.retailPrice?.toFixed(2)}
                            </div>
                            {product.wholesalePrice && (
                                <div className="text-lg text-gray-500">
                                    Wholesale: LKR {product.wholesalePrice?.toFixed(2)}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Quantity Selector */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-800">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-gray-300 rounded-xl">
                                    <button 
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1}
                                        className="p-3 text-gray-600 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Minus className="size-5" />
                                    </button>
                                    <span className="px-4 py-2 text-lg font-semibold min-w-12 text-center">
                                        {quantity}
                                    </span>
                                    <button 
                                        onClick={increaseQuantity}
                                        disabled={quantity >= (product.stock || 10)}
                                        className="p-3 text-gray-600 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="size-5" />
                                    </button>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {product.stock || 10} available
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.stock || addingToCart}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 px-8 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {addingToCart ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="size-5" />
                                        Add to Cart
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleAddToWishlist}
                                className="p-4 border-2 border-gray-300 text-gray-600 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200"
                            >
                                <Heart className={`size-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                            </button>

                            <button
                                onClick={handleShareProduct}
                                className="p-4 border-2 border-gray-300 text-gray-600 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200"
                            >
                                <Share2 className="size-5" />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Truck className="size-5 text-emerald-600" />
                                <div>
                                    <div className="font-semibold">Free Shipping</div>
                                    <div className="text-sm">Over LKR 5000</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <RotateCcw className="size-5 text-emerald-600" />
                                <div>
                                    <div className="font-semibold">30-Day Return</div>
                                    <div className="text-sm">Easy returns</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Shield className="size-5 text-emerald-600" />
                                <div>
                                    <div className="font-semibold">Quality Guarantee</div>
                                    <div className="text-sm">Pharmacy grade</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information Tabs */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-16">
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                            <button className="flex-1 px-6 py-4 font-semibold text-gray-800 border-b-2 border-emerald-500">
                                Product Details
                            </button>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Category</span>
                                        <span className="font-medium">{product.category}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Stock</span>
                                        <span className="font-medium">{product.stock || 10} units</span>
                                    </div>
                                    {product.expiryDate && (
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Expiry Date</span>
                                            <span className="font-medium">{new Date(product.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping & Returns</h3>
                                <div className="space-y-3 text-gray-600">
                                    <p>• Free shipping on orders over LKR 5000</p>
                                    <p>• Express delivery available</p>
                                    <p>• 30-day return policy</p>
                                    <p>• Contact-free delivery options</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-16">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
                        
                        {/* Rating Summary */}
                        <div className="flex items-center gap-8 mb-8">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-gray-800">{averageRating.toFixed(1)}</div>
                                <div className="flex justify-center mt-2">{renderStars(Math.round(averageRating))}</div>
                                <div className="text-gray-600 mt-1">{reviews.length} reviews</div>
                            </div>
                            <div className="flex-1">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = reviews.filter(review => review.rating === star).length;
                                    const percentage = (count / reviews.length) * 100;
                                    return (
                                        <div key={star} className="flex items-center gap-3 mb-2">
                                            <span className="text-sm text-gray-600 w-4">{star}</span>
                                            <Star className="size-4 text-yellow-400 fill-yellow-400" />
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-yellow-400 h-2 rounded-full" 
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 w-12">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                                <span className="font-semibold text-emerald-600">
                                                    {review.user.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">{review.user}</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex">{renderStars(review.rating)}</div>
                                                    {review.verified && (
                                                        <span className="flex items-center gap-1 text-emerald-600 text-sm">
                                                            <Check className="size-3" />
                                                            Verified Purchase
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(review.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <div key={relatedProduct._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <img 
                                    src={relatedProduct.imageUrl} 
                                    alt={relatedProduct.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <div className="text-sm text-blue-600 font-medium mb-1">
                                        {relatedProduct.category}
                                    </div>
                                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                                        {relatedProduct.name}
                                    </h3>
                                    <div className="text-lg font-bold text-emerald-600">
                                        LKR {relatedProduct.retailPrice.toFixed(2)}
                                    </div>
                                    <button className="w-full mt-3 bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;