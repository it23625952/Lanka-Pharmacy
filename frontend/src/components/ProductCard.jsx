import React from 'react';
import { Link } from 'react-router';

/**
 * Product card component that displays essential product information.
 * Provides a clickable card that navigates to the product detail page.
 * 
 * @param {Object} product - The product object to display
 * @param {string} product._id - The unique identifier for the product
 * @param {string} product.name - The name of the product
 * @param {number} product.retailPrice - The retail price of the product
 * @param {string} [product.description] - Optional product description
 * @param {string} [product.category] - Optional product category
 * @param {number} [product.stock] - Optional stock quantity
 * @returns {JSX.Element} The rendered product card component
 */
const ProductCard = ({ product }) => {
  const { _id, name, retailPrice, description, category, stock } = product;

  return (
    <Link
      to={`/product/${_id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-primary group"
      aria-label={`View details for ${name}`}
    >
      <div className="card-body p-4">
        
        {/* Product name with truncation for long names */}
        <h3 className="card-title text-base-content text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Product category badge if available */}
        {category && (
          <div className="badge badge-outline badge-sm text-base-content/60">
            {category}
          </div>
        )}

        {/* Product description with line clamping */}
        {description && (
          <p className="text-base-content/70 text-sm line-clamp-3 mt-2">
            {description}
          </p>
        )}

        {/* Price and stock information */}
        <div className="card-actions justify-between items-center mt-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">
              ${retailPrice?.toFixed(2)}
            </span>
            <span className="text-sm text-base-content/60">
              Retail Price
            </span>
          </div>

          {/* Stock status indicator */}
          {stock !== undefined && (
            <div className={`badge badge-lg ${stock > 0 ? 'badge-success' : 'badge-error'}`}>
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;