import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Mail, ArrowLeft } from 'lucide-react';
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
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

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
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;