import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Key, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { Link, useParams, useNavigate } from 'react-router';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });
  const [tokenValid, setTokenValid] = useState(true);
  const { token } = useParams();
  const navigate = useNavigate();

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      toast.error('Invalid reset link');
    }
  }, [token]);

  /**
   * Handles password reset form submission
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password confirmation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Send password reset request to API
      await api.post(`/users/reset-password/${token}`, { password });
      toast.success('Password reset successfully!');
      navigate('/signin');
    } catch (error) {
      console.error('Reset password error:', error);
      // Handle invalid or expired token
      if (error.response?.status === 400) {
        setTokenValid(false);
        toast.error('Invalid or expired reset link');
      } else {
        toast.error(error.response?.data?.message || 'Failed to reset password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggles password visibility for specific field
   * @param {string} field - The password field to toggle visibility
   */
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Display error state if token is invalid
  if (!tokenValid) {
    return (
      <div className='min-h-screen bg-base-200 flex flex-col'>
        <Navbar />
        <div className='flex-1 flex items-center justify-center p-4'>
          <div className='w-full max-w-md text-center'>
            {/* Error alert for invalid token */}
            <div className="alert alert-error mb-4">
              <span>Invalid or expired reset link</span>
            </div>
            {/* Link to request new reset token */}
            <Link to="/forgot-password" className="btn btn-primary">
              Get New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-base-200 flex flex-col'>
      <Navbar />
      
      <div className='flex-1 flex items-center justify-center p-4'>
        <div className='w-full max-w-md'>
          {/* Password Reset Card */}
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
                  <Key className="size-8 text-primary" />
                </div>
                <h2 className='text-2xl font-bold text-base-content'>Set New Password</h2>
                <p className='text-base-content/60 mt-2'>Enter your new password below</p>
              </div>

              {/* Password Reset Form */}
              <form onSubmit={handleSubmit} className='space-y-4'>
                {/* New Password Field */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text font-medium'>New Password</span>
                  </label>
                  <div className="relative">
                    <input 
                      type={showPasswords.password ? 'text' : 'password'}
                      placeholder='Enter new password' 
                      className='input input-bordered input-md w-full pr-10' 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    {/* Password Visibility Toggle Button */}
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => togglePasswordVisibility('password')}
                      tabIndex={-1}
                      aria-label={showPasswords.password ? "Hide password" : "Show password"}
                    >
                      {showPasswords.password ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text font-medium'>Confirm Password</span>
                  </label>
                  <div className="relative">
                    <input 
                      type={showPasswords.confirmPassword ? 'text' : 'password'}
                      placeholder='Confirm new password' 
                      className='input input-bordered input-md w-full pr-10' 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    {/* Password Visibility Toggle Button */}
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      tabIndex={-1}
                      aria-label={showPasswords.confirmPassword ? "Hide password" : "Show password"}
                    >
                      {showPasswords.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
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
                      <Key className="size-4" />
                    )}
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;