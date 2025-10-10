import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Lock } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const DeleteAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      await api.delete('/users/deleteAccount', {
        data: { password: deletePassword }
      });
      
      onSuccess();
      
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
      setDeletePassword('');
    }
  };

  const handleClose = () => {
    setDeletePassword('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                <AlertTriangle className="size-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Delete Account</h3>
                <p className="text-red-100 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white hover:text-red-100 transition-colors duration-200 p-2 hover:bg-white/10 rounded-xl"
            >
              <X className="size-6" />
            </button>
          </div>
        </div>
        
        {/* Warning Content */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Warning Message */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="size-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800 text-lg mb-2">Permanent Action</h4>
                  <ul className="text-red-700 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      All your personal data will be permanently deleted
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      Your prescription history will be removed
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      All order records will be erased
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      This action cannot be reversed or recovered
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Password Confirmation */}
            <div className="space-y-4">
              <label className="text-lg font-semibold text-gray-700 flex items-center gap-3">
                <Lock className="size-5 text-red-600" />
                Confirm Your Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password to confirm"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  autoComplete="current-password"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="size-5" />
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                For security reasons, please enter your password to confirm account deletion
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
            <button 
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              onClick={handleClose}
              disabled={isDeleting}
            >
              <X className="size-5" />
              Cancel
            </button>
            <button 
              className="flex-1 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDeleteAccount}
              disabled={isDeleting || !deletePassword}
            >
              {isDeleting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="size-5" />
                  <span>Delete Account</span>
                </>
              )}
            </button>
          </div>

          {/* Final Warning */}
          <div className="text-center mt-6">
            <p className="text-red-600 text-sm font-semibold">
              ⚠️ This is your final warning before permanent deletion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;