import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';
import { ArrowLeft, MapPin, User, Phone, Home, Package, CheckCircle, CreditCard, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    address: '',
    location: '',
    phoneNo: ''
  });

  const [errors, setErrors] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem('userId') || '68e77fb18635b78295a20e0b';

  // Fetch cart from backend
  useEffect(() => {
    axios.get(`http://localhost:5001/api/cart/${userId}`)
      .then(res => {
        const items = res.data.items || res.data.cart?.items || [];
        setCartItems(items);
      })
      .catch(err => console.error('❌ Failed to load cart:', err.message));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent numbers in name field
    if (name === 'name') {
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, '');
      setForm(prev => ({ ...prev, [name]: lettersOnly }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(form.name)) {
      newErrors.name = 'Name must contain only letters';
    }

    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (form.address.length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }

    if (!form.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!/^\d{10}$/.test(form.phoneNo)) {
      newErrors.phoneNo = 'Phone number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const order = {
        ...form,
        items: cartItems,
        orderDate: new Date().toISOString(),
        orderNumber: `ORD-${Date.now()}`
      };

      localStorage.setItem('pendingOrder', JSON.stringify(order));
      navigate('/confirmationpage');
      setIsSubmitting(false);
    }, 1500);
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
      <Navbar />

      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link to="/cart" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200">
            <ArrowLeft className="size-5" />
            <span className="font-medium">Back to Cart</span>
          </Link>
        </div>
      </div>

      <div className='flex-1 container mx-auto px-4 py-8 max-w-6xl'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4'>
            Checkout
          </h1>
          <p className='text-gray-600 text-xl'>Complete your order with secure checkout</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column - Delivery Information */}
          <div className='space-y-8'>
            {/* Delivery Details Card */}
            <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>
              <div className='bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6'>
                <div className='flex items-center gap-4'>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                    <MapPin className="size-7 text-white" />
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-white'>Delivery Information</h2>
                    <p className='text-emerald-100'>Enter your delivery details</p>
                  </div>
                </div>
              </div>

              <div className='p-8 space-y-6'>
                {/* Name Field */}
                <div>
                  <label className='block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-3'>
                    <User className="size-5 text-emerald-600" />
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 ${
                        errors.name 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                      }`}
                      maxLength={40}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <User className="size-5" />
                    </div>
                  </div>
                  {errors.name && <p className="text-red-600 text-sm mt-2 flex items-center gap-2">{errors.name}</p>}
                </div>

                {/* Address Field */}
                <div>
                  <label className='block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-3'>
                    <Home className="size-5 text-emerald-600" />
                    Address
                  </label>
                  <div className="relative">
                    <textarea
                      name="address"
                      placeholder="Enter your complete address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none ${
                        errors.address 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                      }`}
                      maxLength={100}
                    />
                    <div className="absolute left-4 top-4 text-gray-400">
                      <Home className="size-5" />
                    </div>
                  </div>
                  {errors.address && <p className="text-red-600 text-sm mt-2 flex items-center gap-2">{errors.address}</p>}
                </div>

                {/* Location Field */}
                <div>
                  <label className='block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-3'>
                    <MapPin className="size-5 text-emerald-600" />
                    Location
                  </label>
                  <div className="relative">
                    <input
                      name="location"
                      placeholder="Enter your city/town"
                      value={form.location}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 ${
                        errors.location 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                      }`}
                      maxLength={50}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <MapPin className="size-5" />
                    </div>
                  </div>
                  {errors.location && <p className="text-red-600 text-sm mt-2 flex items-center gap-2">{errors.location}</p>}
                </div>

                {/* Phone Field */}
                <div>
                  <label className='block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-3'>
                    <Phone className="size-5 text-emerald-600" />
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      name="phoneNo"
                      placeholder="Enter 10-digit phone number"
                      value={form.phoneNo}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 ${
                        errors.phoneNo 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                      }`}
                      maxLength={10}
                      inputMode="numeric"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone className="size-5" />
                    </div>
                  </div>
                  {errors.phoneNo && <p className="text-red-600 text-sm mt-2 flex items-center gap-2">{errors.phoneNo}</p>}
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <Shield className="size-8 text-emerald-600" />
                <div>
                  <h3 className="font-semibold text-emerald-800 text-lg">Secure Checkout</h3>
                  <p className="text-emerald-700">Your personal information is encrypted and secure</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className='space-y-8'>
            {/* Order Summary Card */}
            <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>
              <div className='bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6'>
                <div className='flex items-center gap-4'>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                    <Package className="size-7 text-white" />
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-white'>Order Summary</h2>
                    <p className='text-emerald-100'>{cartItems.length} item(s) in cart</p>
                  </div>
                </div>
              </div>

              <div className='p-8'>
                {cartItems.length > 0 ? (
                  <div className='space-y-4'>
                    {cartItems.map((item, idx) => {
                      const name = item.productId?.name || item.name || 'Unnamed Product';
                      const price = item.productId?.retailPrice || item.price || 0;
                      const subtotal = price * item.quantity;

                      return (
                        <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-200">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 text-lg">{name}</div>
                            <div className="text-gray-600 text-sm mt-1">
                              {item.quantity} × LKR {price.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-emerald-600 text-lg">LKR {subtotal.toFixed(2)}</div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Total Amount */}
                    <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-gray-200">
                      <span className="text-xl font-bold text-gray-800">Total Amount:</span>
                      <span className="text-2xl font-bold text-emerald-600">LKR {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="size-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg">No items in your cart</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Card */}
            <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>
              <div className='bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6'>
                <div className='flex items-center gap-4'>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                    <CreditCard className="size-7 text-white" />
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-white'>Payment Method</h2>
                    <p className='text-emerald-100'>Cash on Delivery</p>
                  </div>
                </div>
              </div>

              <div className='p-8'>
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 text-center">
                  <CheckCircle className="size-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">Cash on Delivery</h3>
                  <p className="text-emerald-700">Pay when you receive your order</p>
                </div>

                {/* Checkout Button */}
                <button 
                  onClick={handleCheckout}
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full mt-6 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="size-6" />
                      <span>Confirm & Place Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;