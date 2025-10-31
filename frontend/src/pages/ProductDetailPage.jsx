import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Package, Plus, Minus, Edit, Trash2, MoreVertical, Heart, Share2, Truck, RotateCcw, Shield, Star, Check } from 'lucide-react';
import Navbar from '../components/Navbar';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Sample data for demonstration
  const averageRating = 4.7;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProduct(response.data);
        
        // Sample reviews data
        setReviews([
          { id: 1, user: 'John Doe', rating: 5, comment: 'Great product! Fast delivery.', date: '2024-01-15', verified: true },
          { id: 2, user: 'Jane Smith', rating: 4, comment: 'Good quality medicine.', date: '2024-01-10', verified: true }
        ]);
        
        // Sample related products
        setRelatedProducts([
          { _id: '1', name: 'Similar Product 1', category: 'Medicine', retailPrice: 45.00, imageUrl: '' },
          { _id: '2', name: 'Similar Product 2', category: 'Healthcare', retailPrice: 35.00, imageUrl: '' },
          { _id: '3', name: 'Similar Product 3', category: 'Wellness', retailPrice: 55.00, imageUrl: '' }
        ]);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        alert('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;
    
    setAddingToCart(true);
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:5001/api/cart/add', {
        userId: userId,
        productId: product._id,
        quantity: quantity,
        customerType: 'retail'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        // AUTO-NAVIGATE DIRECTLY TO CART PAGE
        navigate('/cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      if (error.response?.status === 401) {
        alert('Please login to add items to cart');
        navigate('/signIn');
      } else {
        alert('Failed to add product to cart. Please try again.');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity(prev => product.stock > 0 && prev < product.stock ? prev + 1 : prev);
  };

  const handleEditProduct = () => {
    // Edit functionality
    console.log('Edit product:', product._id);
  };

  const handleDeleteProduct = () => {
    // Delete functionality
    setDeleting(true);
    console.log('Delete product:', product._id);
    setTimeout(() => setDeleting(false), 2000);
  };

  const handleAddToWishlist = () => {
    setIsInWishlist(!isInWishlist);
  };

  const handleShareProduct = () => {
    // Share functionality
    console.log('Share product');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`size-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="size-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h2>
          <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Stock status with YOUR styling
  const stockStatus = {
    text: product.stock > 0 ? `${product.stock} in stock` : 'Out of stock',
    bg: product.stock > 0 ? 'bg-emerald-100' : 'bg-red-100',
    color: product.stock > 0 ? 'text-emerald-800' : 'text-red-800'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <Navbar />
      
      {/* Navigation - YOUR STYLING */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200 font-semibold"
          >
            <ArrowLeft className="size-5" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className='flex items-center gap-2 text-sm text-gray-600 mb-6'>
          <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/" className="hover:text-emerald-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        {/* Back Button and Actions */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="size-5" />
            <span>Back</span>
          </button>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="p-2 border-2 border-gray-300 text-gray-600 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200"
            >
              <MoreVertical className="size-5" />
            </button>

            {showActionsMenu && (
              <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 min-w-48">
                <button
                  onClick={handleEditProduct}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
                >
                  <Edit className="size-4" />
                  Edit Product
                </button>
                <button
                  onClick={handleDeleteProduct}
                  disabled={deleting}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {deleting ? (
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  {deleting ? 'Deleting...' : 'Delete Product'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Product Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                    onError={(e) => {
                      console.error('Failed to load product image:', product.imageUrl);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-80 flex items-center justify-center">
                    <Package className="size-24 text-emerald-400" />
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              <div className="flex gap-3 overflow-x-auto">
                {[product.imageUrl, '/api/placeholder/300/300', '/api/placeholder/300/300'].map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-xl overflow-hidden ${
                      selectedImage === index ? 'border-emerald-500' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Failed to load thumbnail:', img);
                        e.target.style.display = 'none';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category & Status */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                    {product.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${stockStatus.bg} ${stockStatus.color} ${stockStatus.bg.includes('emerald') ? 'border-emerald-200' : 'border-red-200'}`}>
                    {stockStatus.text}
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(averageRating))}
                    <span className="text-gray-600 ml-2">{averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{reviews.length} reviews</span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-emerald-600">
                    LKR {product.retailPrice?.toFixed(2)}
                  </div>
                  {product.wholesalePrice && (
                    <div className="text-gray-500 text-lg">
                      Wholesale: LKR {product.wholesalePrice?.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="border-t border-gray-200 pt-6">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-700 font-semibold">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="w-12 h-12 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="size-5" />
                    </button>
                    <span className="w-16 text-center font-semibold text-xl text-gray-800 bg-white border-2 border-gray-200 rounded-xl py-2">
                      {quantity}
                    </span>
                    <button 
                      onClick={increaseQuantity}
                      disabled={quantity >= (product.stock || 10)}
                      className="w-12 h-12 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="size-5" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {product.stock || 10} available
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.stock || addingToCart}
                    className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                      product.stock > 0
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } ${addingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {addingToCart ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="size-6" />
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-gray-200">
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
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
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
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
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
              <div key={relatedProduct._id} className="bg-white rounded-3xl shadow-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                  {relatedProduct.imageUrl ? (
                    <img 
                      src={relatedProduct.imageUrl} 
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Failed to load related product image:', relatedProduct.imageUrl);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Package className="size-12 text-emerald-400" />
                  )}
                </div>
                <div className="p-6">
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    {relatedProduct.category}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <div className="text-lg font-bold text-emerald-600 mb-4">
                    LKR {relatedProduct.retailPrice.toFixed(2)}
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200">
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