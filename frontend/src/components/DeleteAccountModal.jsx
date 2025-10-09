import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const DeleteAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  /**
   * Handles account deletion with password confirmation
   */
  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      // For enhanced security, send password confirmation
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

  /**
   * Handles modal close and resets form
   */
  const handleClose = () => {
    setDeletePassword('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="text-red-600 size-7" />
          <h3 className="font-bold text-2xl text-gray-800">Confirm Account Deletion</h3>
        </div>
        
        <p className="py-2 text-gray-600 text-lg mb-6">
          This action is permanent and cannot be undone. All your data will be permanently deleted.
        </p>
        
        <div className="form-control mb-6">
          <label className="label mb-2">
            <span className="label-text font-semibold text-gray-700 text-lg">Enter your password to confirm</span>
          </label>
          <input
            type="password"
            placeholder="Your password"
            className="input input-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 text-gray-800 placeholder-gray-500"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        
        <div className="flex gap-3">
          <button 
            className="btn border-2 border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 flex-1 py-3 transition-all duration-200"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            className="btn bg-gradient-to-r from-red-600 to-red-700 border-none text-white hover:from-red-700 hover:to-red-800 flex-1 py-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            onClick={handleDeleteAccount}
            disabled={isDeleting || !deletePassword}
          >
            {isDeleting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Trash2 className="size-5" />
            )}
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;