import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CheckCircle, Package, Truck, Home, ShoppingBag, Clock, Mail, Phone } from 'lucide-react';

const ConfirmationPage = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve order from localStorage
    const savedOrder = localStorage.getItem('pendingOrder');
    if (savedOrder) {
      const orderData = JSON.parse(savedOrder);
      setOrder(orderData);
      
      // Clear the cart after order confirmation
      localStorage.removeItem('pendingOrder');
    } else {
      // Redirect to home if no order found
      navigate('/');
    }
  }, [navigate]);

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2); // 2 days delivery
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!order) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center'>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const totalAmount = order.items?.reduce((sum, item) => {
    const price = item.productId?.retailPrice || item.price || 0;
    return sum + price * item.quantity;
  }, 0) || 0;

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
      <div className='flex-1 container mx-auto px-4 py-8 max-w-4xl'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <CheckCircle className="size-12 text-white" />
          </div>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4'>
            Order Confirmed!
          </h1>
          <p className='text-gray-600 text-xl'>Thank you for shopping with Lanka Pharmacy</p>
        </div>

        {/* Main Confirmation Card */}
        <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8'>
          {/* Success Header */}
          <div className='bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6'>
            <div className='flex items-center gap-4'>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                <Package className="size-7 text-white" />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-white'>Order #{order.orderNumber || 'CONFIRMED'}</h2>
                <p className='text-emerald-100'>We're preparing your order</p>
              </div>
            </div>
          </div>

          <div className='p-8'>
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Delivery Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-4">
                  <Truck className="size-6 text-emerald-600" />
                  Delivery Details
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                    <p className="font-semibold text-emerald-800">{order.name}</p>
                    <p className="text-emerald-700">{order.address}</p>
                    <p className="text-emerald-700">{order.location}</p>
                    <p className="text-emerald-700 mt-2">📞 {order.phoneNo}</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="size-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Estimated Delivery</span>
                    </div>
                    <p className="text-blue-700">{getEstimatedDelivery()}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-4">
                  <ShoppingBag className="size-6 text-emerald-600" />
                  Order Items
                </h3>
                
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {order.items?.map((item, idx) => {
                    const name = item.productId?.name || item.name || 'Unnamed Product';
                    const price = item.productId?.retailPrice || item.price || 0;
                    const subtotal = price * item.quantity;

                    return (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{name}</div>
                          <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-emerald-600">LKR {subtotal.toFixed(2)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total Amount */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                  <span className="text-xl font-bold text-emerald-600">LKR {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-3">
                <CheckCircle className="size-6" />
                What Happens Next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-xl border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="size-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-800 mb-2">Order Processing</h4>
                  <p className="text-sm text-emerald-700">We're preparing your medications</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="size-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-800 mb-2">Delivery</h4>
                  <p className="text-sm text-emerald-700">Your order will be delivered soon</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="size-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-800 mb-2">Confirmation</h4>
                  <p className="text-sm text-emerald-700">We'll confirm when it's on the way</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Need Help With Your Order?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <Phone className="size-8 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Call Us</h4>
              <p className="text-gray-600 mb-3">Speak directly with our pharmacy team</p>
              <a href="tel:+94512225523" className="text-emerald-600 font-semibold hover:text-emerald-700">
                +94 51 222 5523
              </a>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <Mail className="size-8 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Email Support</h4>
              <p className="text-gray-600 mb-3">Get help via email</p>
              <a href="mailto:lp.hatton.sup@gmail.com" className="text-emerald-600 font-semibold hover:text-emerald-700">
                lp.hatton.sup@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg text-center"
          >
            <Home className="size-6" />
            Back to Home
          </Link>
          <Link 
            to="/my-orders"
            className="flex-1 py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 text-lg text-center"
          >
            <ShoppingBag className="size-6" />
            View My Orders
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-8 text-gray-600 text-lg">
          <p>🎉 Thank you for choosing Lanka Pharmacy - Your Trusted Healthcare Partner</p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;