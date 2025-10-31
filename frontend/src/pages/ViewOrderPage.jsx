import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, CreditCard, CheckCircle, Package, User, Home, MapPin, Phone, ShoppingBag } from 'lucide-react';

const ViewOrderPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('pendingOrder');
    if (stored) {
      setOrder(JSON.parse(stored));
    }
  }, []);

  const handleConfirm = () => {
    window.alert('Order confirmed! Your items have been added to cart.');
    navigate('/cart');
  };

  const handleEdit = () => {
    navigate('/edit-order');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setIsDeleting(true);
      setTimeout(() => {
        localStorage.removeItem('pendingOrder');
        navigate('/cart');
        setIsDeleting(false);
      }, 1000);
    }
  };

  const handleProceedToPayment = () => {
    navigate('/payment');
  };

  const getTotal = () => {
    return order?.items?.reduce((sum, item) => {
      const price = item.productId?.retailPrice || item.price || 0;
      return sum + price * item.quantity;
    }, 0) || 0;
  };

  if (!order) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center'>
        <div className="text-center">
          <Package className="size-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Order Found</h2>
          <p className="text-gray-500 mb-6">Please create an order first</p>
          <Link 
            to="/cart"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-semibold transition-all duration-200"
          >
            <ShoppingBag className="size-5" />
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = getTotal();

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link to="/checkout" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200">
            <ArrowLeft className="size-5" />
            <span className="font-medium">Back to Checkout</span>
          </Link>
        </div>
      </div>

      <div className='flex-1 container mx-auto px-4 py-8 max-w-4xl'>
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4'>
            Order Review
          </h1>
          <p className='text-gray-600 text-xl'>Review your order before proceeding</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>
              <div className='bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6'>
                <div className='flex items-center gap-4'>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                    <User className="size-7 text-white" />
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-white'>Delivery Information</h2>
                    <p className='text-emerald-100'>Review your delivery details</p>
                  </div>
                </div>
              </div>

              <div className='p-8'>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <User className="size-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-semibold text-gray-800 text-lg">{order.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Home className="size-5 text-emerald-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold text-gray-800 text-lg">{order.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="size-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-800 text-lg">{order.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="size-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-semibold text-gray-800 text-lg">{order.phoneNo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>
              <div className='bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6'>
                <div className='flex items-center gap-4'>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                    <Package className="size-7 text-white" />
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-white'>Order Items</h2>
                    <p className='text-emerald-100'>{order.items?.length || 0} item(s) in order</p>
                  </div>
                </div>
              </div>

              <div className='p-8'>
                {order.items?.length > 0 ? (
                  <div className='space-y-4'>
                    {order.items.map((item, idx) => {
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

                    <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-gray-200">
                      <span className="text-xl font-bold text-gray-800">Total Amount:</span>
                      <span className="text-2xl font-bold text-emerald-600">LKR {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="size-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg">No items in your order</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>
              <div className='p-8 space-y-4'>
                <button 
                  onClick={handleEdit}
                  className="w-full py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                >
                  <Edit3 className="size-6" />
                  Edit Order
                </button>

                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full py-4 border-2 border-red-600 text-red-600 hover:bg-red-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="size-6" />
                  )}
                  {isDeleting ? 'Deleting...' : 'Delete Order'}
                </button>

                <button 
                  onClick={handleProceedToPayment}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                >
                  <CreditCard className="size-6" />
                  Proceed to Payment
                </button>

                <button 
                  onClick={handleConfirm}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                >
                  <CheckCircle className="size-6" />
                  Confirm Order
                </button>
              </div>
            </div>

            <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>
              <div className='bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4'>
                <h3 className='text-lg font-bold text-white text-center'>Order Summary</h3>
              </div>
              <div className='p-6 space-y-3'>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-semibold">{order.items?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-800">Total:</span>
                  <span className="text-lg font-bold text-emerald-600">LKR {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderPage;