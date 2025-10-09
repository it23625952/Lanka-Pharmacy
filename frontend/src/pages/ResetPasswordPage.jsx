import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { Link, useParams, useNavigate } from 'react-router';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
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
      await api.post(`/users/reset-password/${token}`, { 
        newPassword: password
      });
      
      toast.success('Password reset successfully!');
      setResetSuccess(true);
      
      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
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

  // Display error state if token is invalid
  if (!tokenValid) {
    return (
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
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    {/* Password Visibility Toggle Button */}
                    <button
                      type="button"
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
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;