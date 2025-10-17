import React, { useState } from 'react';
import { Link } from 'react-router';
import { ShoppingCart, Eye, Package } from 'lucide-react';

/**
 * Product card component that displays essential product information.
 * Provides a clickable card that navigates to the product detail page.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.product - The product object to display
 * @param {string} props.viewMode - The display mode ('grid' or 'list')
 * @returns {JSX.Element} The rendered product card component
 */
const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { _id, name, retailPrice, description, category, stock, imageUrl } = product;

  // Construct full image URL for frontend
  const getImageUrl = (url) => {
    if (!url) return null;
    
    // If it's already a full URL, return as is
    if (url.startsWith('http')) return url;
    
    // If it's a relative path, prepend the backend URL
    if (url.startsWith('/')) {
      return `http://localhost:5001${url}`; // Your backend runs on port 5001
    }
    
    return url;
  };

  const fullImageUrl = getImageUrl(imageUrl);

  // Handle image loading errors
  const handleImageError = (e) => {
    console.error(`Failed to load image: ${fullImageUrl}`);
    e.target.style.display = 'none';
  };

  // Grid View Layout
  if (viewMode === 'grid') {
    return (
      <div className="group bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 overflow-hidden">
        {/* Product Image */}
        <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
          {fullImageUrl ? (
            <img 
              src={fullImageUrl} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="size-16 text-emerald-400" />
            </div>
          )}
          
          {/* Stock Status Badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
            stock > 0 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <Link
                to={`/product/${_id}`}
                className="btn btn-sm bg-white text-emerald-600 border-none hover:bg-emerald-50 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Eye className="size-4" />
                View Details
              </Link>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Category Badge */}
          {category && (
            <div className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full mb-3 border border-blue-200">
              {category}
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors duration-200">
            {name}
          </h3>

          {/* Product Description */}
          {description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {description}
            </p>
          )}

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-emerald-600">
                LKR {retailPrice?.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">
                Retail Price
              </span>
            </div>

            <button 
              className={`btn btn-sm gap-2 transition-all duration-200 ${
                stock > 0 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-none text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg' 
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
              disabled={stock === 0}
            >
              <ShoppingCart className="size-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View Layout
  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 p-6">
      <div className="flex items-start gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl overflow-hidden">
          {fullImageUrl ? (
            <img 
              src={fullImageUrl} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="size-8 text-emerald-400" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              {/* Category and Stock */}
              <div className="flex items-center gap-3 mb-2">
                {category && (
                  <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full border border-blue-200">
                    {category}
                  </div>
                )}
                <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  stock > 0 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                </div>
              </div>

              {/* Product Name */}
              <h3 className="font-bold text-gray-800 text-xl mb-2 group-hover:text-emerald-700 transition-colors duration-200">
                {name}
              </h3>

              {/* Product Description */}
              {description && (
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-emerald-600">
                LKR {retailPrice?.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">
                Retail Price
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/product/${_id}`}
                className="btn border-2 border-emerald-500 text-emerald-600 bg-transparent hover:bg-emerald-50 gap-2 transition-all duration-200"
              >
                <Eye className="size-4" />
                View Details
              </Link>
              
              <button 
                className={`btn gap-2 transition-all duration-200 ${
                  stock > 0 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-none text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg' 
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
                disabled={stock === 0}
              >
                <ShoppingCart className="size-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;