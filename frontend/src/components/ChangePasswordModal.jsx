import React, { useState } from 'react';
import { Key, Eye, EyeOff, X, Lock, CheckCircle } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Password complexity validation
  const passwordRequirements = {
    length: passwordData.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(passwordData.newPassword),
    lowercase: /[a-z]/.test(passwordData.newPassword),
    number: /\d/.test(passwordData.newPassword),
    special: /[@$!%*?&]/.test(passwordData.newPassword)
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(req => req);
  const passwordsMatch = passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword;

  const handlePasswordInputChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (!allRequirementsMet) {
      toast.error('Please meet all password requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setIsChangingPassword(true);

    try {
      await api.post('/users/change-password', {
        currentPassword,
        newPassword
      });

      toast.success('Password changed successfully!');
      onSuccess();
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      onClose();
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleClose = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
    onClose();
  };

  // Password requirement component
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                <Key className="size-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Change Password</h3>
                <p className="text-emerald-100 text-sm">Update your account security</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white hover:text-emerald-100 transition-colors duration-200 p-2 hover:bg-white/10 rounded-xl"
            >
              <X className="size-6" />
            </button>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Current Password Field */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-700 flex items-center gap-3">
                <Lock className="size-5 text-emerald-600" />
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="size-5" />
                </div>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-700 flex items-center gap-3">
                <Key className="size-5 text-emerald-600" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  placeholder="Create a strong new password"
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Key className="size-5" />
                </div>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>

              {/* Password Requirements */}
              {passwordData.newPassword && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-700 text-sm mb-3">Password Requirements:</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    <RequirementItem met={passwordRequirements.length} text="8+ characters" />
                    <RequirementItem met={passwordRequirements.uppercase} text="Uppercase letter" />
                    <RequirementItem met={passwordRequirements.lowercase} text="Lowercase letter" />
                    <RequirementItem met={passwordRequirements.number} text="Number" />
                    <RequirementItem met={passwordRequirements.special} text="Special character" />
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-700 flex items-center gap-3">
                <Lock className="size-5 text-emerald-600" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 ${
                    passwordData.confirmPassword && !passwordsMatch
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                  }`}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="size-5" />
                </div>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              
              {/* Password Match Validation */}
              {passwordData.confirmPassword && (
                <div className={`flex items-center gap-2 text-sm ${
                  passwordsMatch ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {passwordsMatch ? (
                    <CheckCircle className="size-4" />
                  ) : (
                    <div className="size-4 rounded-full border-2 border-current" />
                  )}
                  <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
            <button 
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              onClick={handleClose}
              disabled={isChangingPassword}
            >
              <X className="size-5" />
              Cancel
            </button>
            <button 
              className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleChangePassword}
              disabled={isChangingPassword || !allRequirementsMet || !passwordsMatch || !passwordData.currentPassword}
            >
              {isChangingPassword ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Changing Password...</span>
                </>
              ) : (
                <>
                  <Key className="size-5" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>

          {/* Security Note */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              🔒 Your password is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;