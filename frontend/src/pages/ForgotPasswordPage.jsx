import React, { useState } from 'react';
import Navbar from '../components/Navbar';
<<<<<<< HEAD
import { Mail, ArrowLeft, CheckCircle, Send } from 'lucide-react';
=======
import { Mail, ArrowLeft } from 'lucide-react';
>>>>>>> cart
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  /**
   * Handles password reset request form submission
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/users/forgot-password', { email });
      toast.success(response.data.message);
      setEmailSent(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  /**
   * Handles resending the password reset email
   */
  const handleResend = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Reset email sent again!');
    }, 1500);
  };

  // Success state after email is sent
  if (emailSent) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
        <Navbar />
        <div className='flex-1 flex items-center justify-center p-4'>
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNTk2NjkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDJ2MmgtMnptMCA0aDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>

          <div className='relative w-full max-w-md'>
            {/* Success Card */}
            <div className='bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100'>
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="size-12 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-4">Check Your Email</h2>
              <p className="text-gray-600 mb-6 text-lg">
                We've sent a password reset link to
              </p>
              {/* Email Display */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                <p className="font-semibold text-emerald-800">{email}</p>
              </div>

              {/* Help Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-blue-800 text-sm">
                  <strong>Didn't receive the email?</strong>
                </p>
                <ul className="text-blue-700 text-sm mt-2 space-y-1 ml-4">
                  <li>• Check your spam folder</li>
                  <li>• Make sure the email address is correct</li>
                  <li>• Wait a few minutes and check again</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleResend}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Resend Email'
                  )}
                </button>

                <button 
                  onClick={() => setEmailSent(false)}
                  className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200"
                >
                  Try Different Email
                </button>

                <Link to="/signin" className="block text-center text-emerald-600 font-semibold hover:text-emerald-700 pt-2">
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
      <Navbar />
      
      <div className='flex-1 flex items-center justify-center p-4 py-12'>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNTk2NjkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDJ2MmgtMnptMCA0aDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>

        <div className='relative w-full max-w-md'>
          {/* Back to Sign In Link */}
          <Link to="/signin" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition-colors duration-200">
            <ArrowLeft className="size-5" />
            <span className="font-medium">Back to Sign In</span>
          </Link>

          {/* Password Reset Request Card */}
          <div className='bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100'>
            {/* Header Section with Gradient Background */}
            <div className='bg-gradient-to-br from-emerald-600 to-emerald-700 px-8 py-10 text-center'>
              <div className="inline-block bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-xl mb-4">
                <Mail className="size-12 text-white" />
              </div>
              <h1 className='text-3xl font-bold text-white mb-2'>Forgot Password?</h1>
              <p className='text-emerald-100'>Don't worry, we'll help you reset it</p>
            </div>

            {/* Form Section */}
            <div className='p-8'>
              <p className="text-gray-600 text-center mb-6">
                Enter your email address and we'll send you a link to reset your password
              </p>

              <div className='space-y-6'>
                {/* Email Field with Icon */}
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="size-5" />
                    </div>
                    <input
                      type='email'
                      placeholder='your.email@example.com'
                      className='w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800'
                      value={email}
=======
  return (
    <div className='min-h-screen bg-base-200 flex flex-col'>
      <Navbar />
      
      <div className='flex-1 flex items-center justify-center p-4'>
        <div className='w-full max-w-md'>
          {/* Password Reset Request Card */}
          <div className='card bg-base-100 shadow-xl border border-base-300'>
            <div className='card-body p-6 sm:p-8'>
              
              {/* Back to Sign In link */}
              <Link to="/signin" className="btn btn-ghost btn-sm mb-4 self-start">
                <ArrowLeft className="size-4" />
                Back to Sign In
              </Link>

              {/* Header Section */}
              <div className='text-center mb-6'>
                <div className="bg-primary/10 p-3 rounded-full inline-block mb-4">
                  <Mail className="size-8 text-primary" />
                </div>
                <h2 className='text-2xl font-bold text-base-content'>Reset Password</h2>
                <p className='text-base-content/60 mt-2'>
                  {emailSent ? 'Check your email' : 'Enter your email to receive a reset link'}
                </p>
              </div>

              {/* Conditional rendering based on email sent state */}
              {!emailSent ? (
                // Password Reset Request Form
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text font-medium'>Email Address</span>
                    </label>
                    <input 
                      type='email' 
                      placeholder='your.email@example.com' 
                      className='input input-bordered input-md' 
                      value={email} 
>>>>>>> cart
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
<<<<<<< HEAD
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!email || isLoading}
                  className='w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-5" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>

                {/* Back to Sign In Link */}
                <div className='text-center pt-4'>
                  <p className='text-gray-600'>
                    Remember your password?{' '}
                    <Link to="/signin" className='font-bold text-emerald-600 hover:text-emerald-700 transition-colors duration-200'>
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Help and Support Information */}
          <div className='text-center mt-6 text-sm text-gray-500 space-y-2'>
            <p>🔒 Your security is our priority</p>
            <p className='text-xs'>
              Need help? Contact support at{' '}
              <a href="mailto:lp.hatton.sup@gmail.com" className="text-emerald-600 hover:text-emerald-700">
                lp.hatton.sup@gmail.com
              </a>
            </p>
          </div>
=======

                  {/* Submit Button */}
                  <div className='form-control mt-6'>
                    <button 
                      type='submit' 
                      className='btn btn-primary btn-md w-full gap-2'
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <Mail className="size-4" />
                      )}
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              ) : (
                // Success State after email sent
                <div className="text-center py-4">
                  <div className="alert alert-success mb-4">
                    <span>✓ Check your email for the reset link</span>
                  </div>
                  <p className="text-base-content/70 text-sm mb-4">
                    If you don't see the email, check your spam folder or try again.
                  </p>
                  <button 
                    onClick={() => setEmailSent(false)}
                    className="btn btn-outline btn-sm"
                  >
                    Send Another Link
                  </button>
                </div>
              )}
            </div>
          </div>
>>>>>>> cart
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;