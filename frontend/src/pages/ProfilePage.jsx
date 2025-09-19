import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { User, Mail, Phone, MapPin, Edit3, Save, X, Calendar, Trash2, AlertTriangle } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    createdAt: ''
  });
  const [tempData, setTempData] = useState({ ...userData });
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  /**
   * Fetches user profile data from the API
   */
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users/profile');
      setUserData(response.data);
      setTempData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggles edit mode or saves profile changes
   */
  const handleEditToggle = () => {
    if (isEditing) {
      handleSaveProfile();
    } else {
      setTempData(userData);
      setIsEditing(true);
    }
  };

  /**
   * Saves profile changes to the API
   */
  const handleSaveProfile = async () => {
    try {
      const response = await api.put('/users/profile', tempData);
      setUserData(response.data.user || response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  /**
   * Cancels edit mode and reverts changes
   */
  const handleCancelEdit = () => {
    setTempData(userData);
    setIsEditing(false);
  };

  /**
   * Handles input field changes during edit mode
   * @param {string} field - The field name to update
   * @param {string} value - The new value for the field
   */
  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
      
      // Clear local storage and redirect
      localStorage.removeItem('token');
      toast.success('Account deleted successfully');
      navigate('/signUp');
      
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeletePassword('');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-base-200 flex flex-col'>
        <Navbar />
        <div className='flex-1 flex items-center justify-center'>
          <div className='loading loading-spinner loading-lg text-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-base-200 flex flex-col'>
      <Navbar />
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="modal-box bg-base-100 max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-error size-6" />
              <h3 className="font-bold text-lg">Confirm Account Deletion</h3>
            </div>
            
            <p className="py-2 text-base-content/80 mb-4">
              This action is permanent and cannot be undone. All your data will be permanently deleted.
            </p>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Enter your password to confirm</span>
              </label>
              <input
                type="password"
                placeholder="Your password"
                className="input input-bordered w-full"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword('');
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error gap-2"
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword}
              >
                {isDeleting ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <Trash2 className="size-4" />
                )}
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='flex-1 container mx-auto px-4 py-8 max-w-4xl'>
        {/* Header Section */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-base-content mb-2'>User Profile</h1>
          <p className='text-base-content/60'>Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className='card bg-base-100 shadow-xl border border-base-300'>
          <div className='card-body p-6'>
            
            {/* Profile Header with Edit Button */}
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold text-base-content'>Personal Information</h2>
              <div className='flex gap-2'>
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSaveProfile}
                      className='btn btn-success btn-sm gap-2'
                    >
                      <Save className='size-4' />
                      Save
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className='btn btn-ghost btn-sm gap-2'
                    >
                      <X className='size-4' />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleEditToggle}
                    className='btn btn-outline btn-sm gap-2'
                  >
                    <Edit3 className='size-4' />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className='space-y-4'>
              {/* Name Field */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium flex items-center gap-2'>
                    <User className='size-4' />
                    Full Name
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type='text'
                    className='input input-bordered input-md'
                    value={tempData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <p className='text-base-content'>{userData.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium flex items-center gap-2'>
                    <Mail className='size-4' />
                    Email Address
                  </span>
                </label>
                <p className='text-base-content'>{userData.email}</p>
                <span className='text-xs text-base-content/60'>Email cannot be changed</span>
              </div>

              {/* Phone Field */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium flex items-center gap-2'>
                    <Phone className='size-4' />
                    Phone Number
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type='tel'
                    className='input input-bordered input-md'
                    value={tempData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder='Add phone number'
                  />
                ) : (
                  <p className='text-base-content'>{userData.phone || 'Not provided'}</p>
                )}
              </div>

              {/* Address Field */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium flex items-center gap-2'>
                    <MapPin className='size-4' />
                    Address
                  </span>
                </label>
                {isEditing ? (
                  <textarea
                    className='textarea textarea-bordered'
                    value={tempData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    placeholder='Enter your address'
                  />
                ) : (
                  <p className='text-base-content'>{userData.address || 'Not provided'}</p>
                )}
              </div>

              {/* Role Field */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium'>Role</span>
                </label>
                <div className='badge badge-primary badge-lg'>
                  {userData.role || 'User'}
                </div>
              </div>

              {/* Account Created Date */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium flex items-center gap-2'>
                    <Calendar className='size-4' />
                    Member Since
                  </span>
                </label>
                <p className='text-base-content/70 text-sm'>
                  {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Additional Sections */}
            {!isEditing && (
              <div className='mt-8 pt-6 border-t border-base-300'>
                <h3 className='text-lg font-semibold text-base-content mb-4'>Account Actions</h3>
                <div className='space-y-2'>
                  <button className='btn btn-outline btn-primary btn-sm w-full justify-start'>
                    Change Password
                  </button>
                  <button 
                    className='btn btn-outline btn-error btn-sm w-full justify-start gap-2'
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="size-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;