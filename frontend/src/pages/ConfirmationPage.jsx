import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CheckCircle, Package, Truck, Home, ShoppingBag, Clock, Mail, Phone } from 'lucide-react';

const ConfirmationPage = () => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrder = localStorage.getItem('pendingOrder');
    
    if (savedOrder) {
      try {
        const orderData = JSON.parse(savedOrder);
        setOrder(orderData);
        
        // ✅ FIX: Only remove after a delay or don't remove at all
        setTimeout(() => {
          localStorage.removeItem('pendingOrder');
        }, 1000); // Remove after 1 second
        
      } catch (error) {
        console.error('Error parsing order data:', error);
        navigate('/');
      }
    } else {
      // ✅ FIX: Add a small delay before redirecting
      setTimeout(() => {
        navigate('/');
      }, 100);
    }
    
    setIsLoading(false);
  }, [navigate]);

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // ✅ FIX: Better loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center'>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // ✅ FIX: Only show this if order is truly not available
  if (!order) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center'>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Order Found</h1>
          <p className="text-gray-600 mb-6">Unable to load order information.</p>
          <Link 
            to="/"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Home
          </Link>
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

        
      </div>
    </div>
  );
};

export default ConfirmationPage;