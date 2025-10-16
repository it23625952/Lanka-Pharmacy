import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Package, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || 'guest';

  useEffect(() => {
    axios.get(`http://localhost:5001/api/cart/${userId}`)
      .then(res => {
        const items = res.data.items || res.data.cart?.items || [];
        setCartItems(items);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Failed to fetch cart:', err.message);
        setLoading(false);
      });
  }, [userId]);

  const handleRemove = (itemId) => {
    axios.delete(`http://localhost:5001/api/cart/remove/${itemId}`)
      .then(() => {
        setCartItems(prev => prev.filter(item => item._id !== itemId));
      })
      .catch(err => console.error('❌ Remove failed:', err.message));
  };

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty < 1) return;

    axios.put(`http://localhost:5001/api/cart/update/${itemId}`, { quantity: newQty })
      .then(() => {
        setCartItems(prev =>
          prev.map(item =>
            item._id === itemId ? { ...item, quantity: newQty } : item
          )
        );
      })
      .catch(err => console.error('❌ Quantity update failed:', err.message));
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.productId?.retailPrice || item.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  const totalAmount = getTotal();

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200">
            <ArrowLeft className="size-5" />
            <span className="font-medium">Back to Shopping</span>
          </Link>
        </div>
      </div>

      <div className='flex-1 container mx-auto px-4 py-8 max-w-4xl'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4'>
            Shopping Cart
          </h1>
          <p className='text-gray-600 text-xl'>Review and manage your items</p>
        </div>

        {/* Cart Content */}
        <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>
          {/* Cart Header */}
          <div className='bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6'>
            <div className='flex items-center gap-4'>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                <ShoppingCart className="size-7 text-white" />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-white'>Your Cart Items</h2>
                <p className='text-emerald-100'>{cartItems.length} item(s) selected</p>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className='p-8'>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-16">
                <Package className="size-24 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h3>
                <p className="text-gray-500 text-lg mb-8">Add some products to get started</p>
                <Link 
                  to="/"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <ShoppingCart className="size-5" />
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className='space-y-6'>
                {/* Cart Items List */}
                {cartItems.map(item => {
                  const name = item.productId?.name || item.name || 'Unnamed Product';
                  const price = item.productId?.retailPrice || item.price || 0;
                  const subtotal = price * item.quantity;

                  return (
                    <div key={item._id} className='bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300'>
                      <div className="flex justify-between items-start">
                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
                          <div className="flex items-center gap-6 text-gray-600">
                            <span className="text-lg font-medium">LKR {price.toFixed(2)} each</span>
                            <span className="text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                              In Stock
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-2xl transition-all duration-200 ml-4"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </div>

                      {/* Quantity Controls and Subtotal */}
                      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-700 font-medium">Quantity:</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              className="w-12 h-12 border-2 border-gray-300 text-gray-600 rounded-2xl hover:bg-gray-50 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="size-5" />
                            </button>
                            <span className="w-16 text-center font-semibold text-xl text-gray-800 bg-white border-2 border-gray-200 rounded-2xl py-2">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="w-12 h-12 border-2 border-gray-300 text-gray-600 rounded-2xl hover:bg-gray-50 flex items-center justify-center transition-all duration-200"
                            >
                              <Plus className="size-5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-gray-600">Subtotal</div>
                          <div className="text-2xl font-bold text-emerald-600">LKR {subtotal.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Cart Summary */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-8 mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-emerald-800">Order Summary</h3>
                    <div className="text-right">
                      <div className="text-sm text-emerald-600">Total Items</div>
                      <div className="text-xl font-bold text-emerald-800">{cartItems.length}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-2xl font-bold text-emerald-800 border-t border-emerald-200 pt-6">
                    <span>Total Amount:</span>
                    <span className="text-3xl">LKR {totalAmount.toFixed(2)}</span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full mt-8 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="size-6" />
                  </button>

                  {/* Continue Shopping Link */}
                  <div className="text-center mt-6">
                    <Link 
                      to="/"
                      className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200"
                    >
                      <ArrowLeft className="size-4" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-8 text-gray-600 text-lg">
          <p>🔒 Secure checkout • 🚚 Free delivery over LKR 2000 • 💯 Quality guaranteed</p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;