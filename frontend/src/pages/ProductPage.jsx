import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Optional—used if available

  // Real product from your database
  const product = {
    _id: '68b9c4d7af37a5fff39263c4',
    name: 'Panadol',
    description: 'Panadol Tablets provide effective relief of aches and pains, such as headache, muscle pain, and fever.',
    price: 50, // Using retailPrice
    image: 'https://unionchemistspharmacy.lk/wp-content/uploads/2022/11/Panadol-Tablets.jpg'
  };

  const handleAddToCart = async () => {
    console.log("🛒 Add to Cart clicked");

    try {
      await axios.post('http://localhost:5001/api/cart/add', {
        userId,
        productId: product._id,
        quantity: 1
      });

      navigate('/cart-page'); // ✅ Redirect to CartPage after adding
    } catch (err) {
      console.error('❌ Error adding to cart:', err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow bg-white">
      <img
        src={product.image}
        alt={product.name || 'Product image'}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-lg font-semibold mb-4">Rs.{product.price}</p>
      <button
        onClick={handleAddToCart}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductPage;
