import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, CreditCard, User, Phone, Lock, Shield, CheckCircle } from 'lucide-react';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nameOnCard: '',
    phoneNo: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});
  const [cardType, setCardType] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const detectCardType = (number) => {
    if (/^4/.test(number)) return 'Visa';
    if (/^5[1-5]/.test(number) || /^2(2[2-9]|[3-6][0-9]|7[01])/.test(number)) return 'MasterCard';
    if (/^3[47]/.test(number)) return 'American Express';
    if (/^6(?:011|5)/.test(number)) return 'Discover';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'nameOnCard') {
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, '');
      setForm(prev => ({ ...prev, nameOnCard: lettersOnly }));
    } else if (name === 'phoneNo') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setForm(prev => ({ ...prev, phoneNo: digitsOnly }));
    } else if (name === 'cardNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 16);
      const formatted = digitsOnly.replace(/(\d{4})/g, '$1 ').trim();
      setForm(prev => ({ ...prev, cardNumber: formatted }));
      setCardType(detectCardType(digitsOnly));
    } else if (name === 'expiry') {
      let formatted = value.replace(/[^\d]/g, '');
      if (formatted.length >= 3) {
        formatted = `${formatted.slice(0, 2)}/${formatted.slice(2, 4)}`;
      }
      setForm(prev => ({ ...prev, expiry: formatted }));
    } else if (name === 'cvv') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 3);
      setForm(prev => ({ ...prev, cvv: digitsOnly }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (!form.nameOnCard.trim()) {
      newErrors.nameOnCard = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(form.nameOnCard)) {
      newErrors.nameOnCard = 'Name must contain only letters';
    }

    if (!/^\d{10}$/.test(form.phoneNo)) {
      newErrors.phoneNo = 'Phone number must be exactly 10 digits';
    }

    const cleanCardNumber = form.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleanCardNumber)) {
      newErrors.cardNumber = 'Card number must be exactly 16 digits';
    }

    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      newErrors.expiry = 'Expiry must be in MM/YY format';
    } else {
      const [mm, yy] = form.expiry.split('/').map(Number);
      if (mm < 1 || mm > 12) {
        newErrors.expiry = 'Month must be between 01 and 12';
      } else if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        newErrors.expiry = 'Card has expired';
      }
    }

    if (!/^\d{3}$/.test(form.cvv)) {
      newErrors.cvv = 'CVV must be exactly 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      navigate('/payment-success');
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link to="/checkout" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200">
            <ArrowLeft className="size-5" />
            <span className="font-medium">Back to Checkout</span>
          </Link>
        </div>
      </div>

      <div className='flex-1 container mx-auto px-4 py-8 max-w-2xl'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4'>
            Payment Details
          </h1>
          <p className='text-gray-600 text-xl'>Complete your purchase securely</p>
        </div>

        {/* Payment Card */}
        <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>
          {/* Header */}
          <div className='bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6'>
            <div className='flex items-center gap-4'>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                <CreditCard className="size-7 text-white" />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-white'>Secure Payment</h2>
                <p className='text-emerald-100'>Your payment information is encrypted</p>
              </div>
            </div>
          </div>

          <div className='p-8'>
            <div className='space-y-6'>
              {/* Name on Card */}
              <div>
                <label className='text-lg font-semibold text-gray-700 mb-3 flex items-center gap-3'>
                  <User className="size-5 text-emerald-600" />
                  Name on Card
                </label>
                <div className="relative">
                  <input
                    name="nameOnCard"
                    placeholder="Enter name as shown on card"
                    value={form.nameOnCard}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 ${
                      errors.nameOnCard 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                    maxLength={40}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="size-5" />
                  </div>
                </div>
                {errors.nameOnCard && <p className="text-red-600 text-sm mt-2 flex items-center gap-2">{errors.nameOnCard}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className='text-lg font-semibold text-gray-700 mb-3 flex items-center gap-3'>
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
                    inputMode="numeric"
                    maxLength={10}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone className="size-5" />
                  </div>
                </div>
                {errors.phoneNo && <p className="text-red-600 text-sm mt-2 flex items-center gap-2">{errors.phoneNo}</p>}
              </div>

              {/* Card Number */}
              <div>
                <label className='text-lg font-semibold text-gray-700 mb-3 flex items-center gap-3'>
                  <CreditCard className="size-5 text-emerald-600" />
                  Card Number
                </label>
                <div className="relative">
                  <input
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={form.cardNumber}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 ${
                      errors.cardNumber 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                    }`}
                    maxLength={19}
                    inputMode="numeric"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <CreditCard className="size-5" />
                  </div>
                </div>
                {cardType && (
                  <div className="flex items-center gap-2 mt-2 text-emerald-600">
                    <CheckCircle className="size-4" />
                    <span className="text-sm font-medium">{cardType}</span>
                  </div>
                )}
                {errors.cardNumber && <p className="text-red-600 text-sm mt-2 flex items-center gap-2">{errors.cardNumber}</p>}
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className='block text-lg font-semibold text-gray-700 mb-3'>
                    Expiry Date
                  </label>
                  <div className="relative">
                    <input
                      name="expiry"
                      placeholder="MM/YY"
                      value={form.expiry}
                      onChange={handleChange}
                      className={`w-full pl-4 pr-4 py-4 border-2 rounded-2xl focus:ring-4 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 ${
                        errors.expiry 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                      }`}
                      maxLength={5}
                      inputMode="numeric"
                    />
                  </div>
                  {errors.expiry && <p className="text-red-600 text-sm mt-2 flex items-center gap-2">{errors.expiry}</p>}
                </div>

                <div>
                  <label className='text-lg font-semibold text-gray-700 mb-3 flex items-center gap-3'>
                    <Lock className="size-5 text-emerald-600" />
                    CVV
                  </label>
                  <div className="relative">
                    <input
                      name="cvv"
                      placeholder="123"
                      value={form.cvv}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 ${
                        errors.cvv 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'
                      }`}
                      maxLength={3}
                      inputMode="numeric"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="size-5" />
                    </div>
                  </div>
                  {errors.cvv && <p className="text-red-600 text-sm mt-2 flex items-center gap-2">{errors.cvv}</p>}
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6 mt-8">
              <div className="flex items-center gap-4">
                <Shield className="size-8 text-emerald-600" />
                <div>
                  <h3 className="font-semibold text-emerald-800 text-lg">Secure Payment</h3>
                  <p className="text-emerald-700">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button 
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full mt-8 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="size-6" />
                  <span>Pay Now</span>
                </>
              )}
            </button>

            {/* Accepted Cards */}
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm mb-3">We accept</p>
              <div className="flex justify-center items-center gap-4">
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">Visa</div>
                <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                <div className="w-12 h-8 bg-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">Amex</div>
                <div className="w-12 h-8 bg-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">Discover</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;