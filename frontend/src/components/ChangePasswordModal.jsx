import React, { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';
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

  /**
   * Handles password input changes
   * @param {string} field - The password field to update
   * @param {string} value - The new value for the field
   */
  const handlePasswordInputChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
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

  /**
   * Handles password change form submission
   */
  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);

    try {
      await api.post('/users/change-password', {
        currentPassword,
        newPassword
      });

      onSuccess();
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  /**
   * Handles modal close and resets form
   */
  const handleClose = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="text-blue-600 size-7" />
          <h3 className="font-bold text-2xl text-gray-800">Change Password</h3>
        </div>
        
        <div className="space-y-5">
          {/* Current Password Field */}
          <div className="form-control">
            <label className="label mb-2">
              <span className="label-text font-semibold text-gray-700 text-lg">Current Password</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                placeholder="Enter current password"
                className="input input-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder-gray-500 pr-12"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div className="form-control">
            <label className="label mb-2">
              <span className="label-text font-semibold text-gray-700 text-lg">New Password</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                placeholder="Enter new password (min 6 characters)"
                className="input input-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder-gray-500 pr-12"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="form-control">
            <label className="label mb-2">
              <span className="label-text font-semibold text-gray-700 text-lg">Confirm New Password</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                className="input input-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder-gray-500 pr-12"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Modal Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button 
            className="btn border-2 border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 flex-1 py-3 transition-all duration-200"
            onClick={handleClose}
            disabled={isChangingPassword}
          >
            Cancel
          </button>
          <button 
            className="btn bg-gradient-to-r from-blue-600 to-blue-800 border-none text-white hover:from-blue-700 hover:to-blue-900 flex-1 py-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            onClick={handleChangePassword}
            disabled={isChangingPassword}
          >
            {isChangingPassword ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Key className="size-5" />
            )}
            {isChangingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;