import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
<<<<<<< HEAD
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
=======
import { Key, ArrowLeft, Eye, EyeOff } from 'lucide-react';
>>>>>>> cart
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { Link, useParams, useNavigate } from 'react-router';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
<<<<<<< HEAD
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
=======
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });
>>>>>>> cart
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

<<<<<<< HEAD
  // Password complexity requirements validation
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password)
  };

  // Form validation states
  const allRequirementsMet = Object.values(passwordRequirements).every(req => req);
  const passwordsMatch = password && password === confirmPassword;

=======
>>>>>>> cart
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
<<<<<<< HEAD
      await api.post(`/users/reset-password/${token}`, { 
        newPassword: password
      });
      
      toast.success('Password reset successfully!');
      setResetSuccess(true);
      
      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
=======
      await api.post(`/users/reset-password/${token}`, { password });
      toast.success('Password reset successfully!');
      navigate('/signin');
>>>>>>> cart
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
<<<<<<< HEAD
   * Reusable component for password requirement items
   * @param {Object} props - Component props
   * @param {boolean} props.met - Whether the requirement is met
   * @param {string} props.text - Requirement description text
   * @returns {JSX.Element} Requirement list item
   */
  const RequirementItem = ({ met, text }) => (
    <li className={`flex items-center gap-2 text-sm transition-colors duration-200 ${met ? 'text-emerald-600' : 'text-gray-500'}`}>
      {met ? (
        <CheckCircle className="size-4 flex-shrink-0" />
      ) : (
        <div className="size-4 rounded-full border-2 border-current flex-shrink-0" />
      )}
      <span>{text}</span>
    </li>
  );
=======
   * Toggles password visibility for specific field
   * @param {string} field - The password field to toggle visibility
   */
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
>>>>>>> cart

  // Display error state if token is invalid
  if (!tokenValid) {
    return (
<<<<<<< HEAD
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
        <Navbar />
        <div className='flex-1 flex items-center justify-center p-4 py-12'>
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNTk2NjkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDJ2MmgtMnptMCA0aDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
          
          <div className='relative w-full max-w-lg text-center'>
            {/* Invalid Token Error Card */}
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-red-800 mb-4">Invalid or Expired Reset Link</h2>
              <p className="text-red-700 mb-6">This password reset link is no longer valid. Please request a new one.</p>
              <Link to="/forgot-password" className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                Get New Reset Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display success state after password reset
  if (resetSuccess) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
        <Navbar />
        <div className='flex-1 flex items-center justify-center p-4'>
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNTk2NjkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDJvMmgtMnptMCA0aDJvMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>

          <div className='relative w-full max-w-md'>
            {/* Success Card */}
            <div className='bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100'>
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="size-12 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-4">Password Reset Successfully!</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Your password has been reset. You can now sign in with your new password.
              </p>

              <Link to="/signin" className="inline-block w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                Sign In Now
              </Link>
            </div>
=======
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
>>>>>>> cart
          </div>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
      <Navbar />
      
      <div className='flex-1 flex items-center justify-center p-4 py-12'>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNTk2NjkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDJvMmgtMnptMCA0aDJvMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>

        <div className='relative w-full max-w-md'>
          {/* Back to Sign In Link */}
          <Link to="/signin" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition-colors duration-200">
            <ArrowLeft className="size-5" />
            <span className="font-medium">Back to Sign In</span>
          </Link>

          {/* Password Reset Card Container */}
          <div className='bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100'>
            {/* Header Section with Gradient Background */}
            <div className='bg-gradient-to-br from-emerald-600 to-emerald-700 px-8 py-10 text-center'>
              <div className="inline-block bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-xl mb-4">
                <Lock className="size-12 text-white" />
              </div>
              <h1 className='text-3xl font-bold text-white mb-2'>Set New Password</h1>
              <p className='text-emerald-100'>Create a strong password for your account</p>
            </div>

            {/* Form Section */}
            <div className='p-8'>
              <div className='space-y-6'>
                {/* New Password Field with Requirements */}
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="size-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter new password'
                      className='w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800'
                      value={password}
=======
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
>>>>>>> cart
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    {/* Password Visibility Toggle Button */}
                    <button
                      type="button"
<<<<<<< HEAD
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>

                  {/* Password Requirements Visualization */}
                  {password && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                      <div className="font-semibold text-gray-700 text-sm mb-3">Password Requirements:</div>
                      <ul className="grid grid-cols-2 gap-2">
                        <RequirementItem met={passwordRequirements.length} text="8+ characters" />
                        <RequirementItem met={passwordRequirements.uppercase} text="Uppercase" />
                        <RequirementItem met={passwordRequirements.lowercase} text="Lowercase" />
                        <RequirementItem met={passwordRequirements.number} text="Number" />
                        <RequirementItem met={passwordRequirements.special} text="Special char" />
                      </ul>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field with Validation */}
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="size-5" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='Confirm new password'
                      className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl outline-none transition-all duration-200 text-gray-800 ${
                        confirmPassword && !passwordsMatch
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                      }`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    {/* Confirm Password Visibility Toggle Button */}
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                  {/* Password Match Validation Message */}
                  {confirmPassword && passwordsMatch && (
                    <div className="mt-2 flex items-center gap-2 text-emerald-600 text-sm">
                      <CheckCircle className="size-4" />
                      <span>Passwords match</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!allRequirementsMet || !passwordsMatch || isLoading}
                  className='w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="size-5" />
                      <span>Reset Password</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Security Trust Badge */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>🔒 Your password is encrypted and secure</p>
          </div>
=======
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
>>>>>>> cart
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;