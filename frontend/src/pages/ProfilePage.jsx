import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
<<<<<<< HEAD
import { User, Mail, Phone, MapPin, Edit3, Save, X, Calendar, Trash2, Key } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import ChangePasswordModal from '../components/ChangePasswordModal';
import DeleteAccountModal from '../components/DeleteAccountModal';
=======
import { User, Mail, Phone, MapPin, Edit3, Save, X, Calendar, Trash2, AlertTriangle, Key, Eye, EyeOff } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
>>>>>>> cart

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
<<<<<<< HEAD
=======
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
>>>>>>> cart
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    createdAt: ''
  });
  const [tempData, setTempData] = useState({ ...userData });
  
<<<<<<< HEAD
=======
  // Change password form state
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
  
>>>>>>> cart
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
<<<<<<< HEAD
   * Handles successful password change
   */
  const handlePasswordChangeSuccess = () => {
    setShowChangePassword(false);
    toast.success('Password changed successfully');
  };

  /**
   * Handles successful account deletion
   */
  const handleAccountDeleteSuccess = () => {
    localStorage.removeItem('token');
    toast.success('Account deleted successfully');
    navigate('/signUp');
=======
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

      toast.success('Password changed successfully');
      setShowChangePassword(false);
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
>>>>>>> cart
  };

  // Loading state
  if (isLoading) {
    return (
<<<<<<< HEAD
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
        <Navbar />
        <div className='flex-1 flex items-center justify-center'>
          <div className='w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin'></div>
=======
      <div className='min-h-screen bg-base-200 flex flex-col'>
        <Navbar />
        <div className='flex-1 flex items-center justify-center'>
          <div className='loading loading-spinner loading-lg text-primary'></div>
>>>>>>> cart
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
      <Navbar />
      
      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSuccess={handlePasswordChangeSuccess}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onSuccess={handleAccountDeleteSuccess}
      />

      <div className='flex-1 container mx-auto px-4 py-8 max-w-4xl'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-4'>
            User Profile
          </h1>
          <p className='text-gray-600 text-xl'>Manage your account information</p>
        </div>

        {/* Profile Card Container */}
        <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>
          {/* Card Header with Gradient Background */}
          <div className='bg-gradient-to-r from-emerald-600 to-emerald-800 p-8'>
            <div className='flex justify-between items-center'>
              <h2 className='text-3xl font-bold text-white'>Personal Information</h2>
              <div className='flex gap-3'>
                {isEditing ? (
                  <>
                    {/* Save Changes Button */}
                    <button 
                      onClick={handleSaveProfile}
                      className='btn bg-green-500 border-none text-white hover:bg-green-600 gap-3 px-6 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center min-h-[52px]'
                    >
                      <Save className='size-5' />
                      Save Changes
                    </button>
                    {/* Cancel Edit Button */}
                    <button 
                      onClick={handleCancelEdit}
                      className='btn border-2 border-white text-white bg-transparent hover:bg-white/10 gap-3 px-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center min-h-[52px]'
                    >
                      <X className='size-5' />
=======
    <div className='min-h-screen bg-base-200 flex flex-col'>
      <Navbar />
      
      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="modal-box bg-base-100 max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <Key className="text-primary size-6" />
              <h3 className="font-bold text-lg">Change Password</h3>
            </div>
            
            <div className="space-y-4">
              {/* Current Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Current Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder="Enter current password"
                    className="input input-bordered w-full pr-10"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                  />
                  {/* Password Visibility Toggle Button */}
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="Enter new password (min 6 characters)"
                    className="input input-bordered w-full pr-10"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                    minLength={6}
                  />
                  {/* Password Visibility Toggle Button */}
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Confirm New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    className="input input-bordered w-full pr-10"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                  />
                  {/* Password Visibility Toggle Button */}
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Modal Action Buttons */}
            <div className="modal-action mt-6">
              <button 
                className="btn btn-ghost"
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                disabled={isChangingPassword}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary gap-2"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <Key className="size-4" />
                )}
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}

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
>>>>>>> cart
                      Cancel
                    </button>
                  </>
                ) : (
<<<<<<< HEAD
                  /* Edit Profile Button */
                  <button 
                    onClick={handleEditToggle}
                    className='btn border-2 border-white text-white bg-transparent hover:bg-white/10 gap-3 px-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center min-h-[52px]'
                  >
                    <Edit3 className='size-5' />
=======
                  <button 
                    onClick={handleEditToggle}
                    className='btn btn-outline btn-sm gap-2'
                  >
                    <Edit3 className='size-4' />
>>>>>>> cart
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
<<<<<<< HEAD
          </div>

          {/* Profile Information Section */}
          <div className='p-8'>
            <div className='space-y-8'>
              {/* Name Field */}
              <div className='form-control'>
                <label className='block mb-4'>
                  <span className='font-semibold text-gray-700 text-xl flex items-center gap-4'>
                    <User className='size-6 text-emerald-600' />
=======

            {/* Profile Information */}
            <div className='space-y-4'>
              {/* Name Field */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium flex items-center gap-2'>
                    <User className='size-4' />
>>>>>>> cart
                    Full Name
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type='text'
<<<<<<< HEAD
                    className='w-full pl-12 pr-4 py-4 border-2 border-gray-200 bg-white rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 text-gray-800 text-lg'
=======
                    className='input input-bordered input-md'
>>>>>>> cart
                    value={tempData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
<<<<<<< HEAD
                  <p className='text-gray-800 text-xl pl-16'>{userData.name}</p>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div className='form-control'>
                <label className='block mb-4'>
                  <span className='font-semibold text-gray-700 text-xl flex items-center gap-4'>
                    <Mail className='size-6 text-emerald-600' />
                    Email Address
                  </span>
                </label>
                <p className='text-gray-800 text-xl pl-16'>{userData.email}</p>
                <span className='text-gray-500 text-lg mt-2 pl-16'>Email cannot be changed</span>
=======
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
>>>>>>> cart
              </div>

              {/* Phone Field */}
              <div className='form-control'>
<<<<<<< HEAD
                <label className='block mb-4'>
                  <span className='font-semibold text-gray-700 text-xl flex items-center gap-4'>
                    <Phone className='size-6 text-emerald-600' />
=======
                <label className='label'>
                  <span className='label-text font-medium flex items-center gap-2'>
                    <Phone className='size-4' />
>>>>>>> cart
                    Phone Number
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type='tel'
<<<<<<< HEAD
                    className='w-full pl-12 pr-4 py-4 border-2 border-gray-200 bg-white rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 text-gray-800 text-lg placeholder-gray-500'
=======
                    className='input input-bordered input-md'
>>>>>>> cart
                    value={tempData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder='Add phone number'
                  />
                ) : (
<<<<<<< HEAD
                  <p className='text-gray-800 text-xl pl-16'>{userData.phone || 'Not provided'}</p>
=======
                  <p className='text-base-content'>{userData.phone || 'Not provided'}</p>
>>>>>>> cart
                )}
              </div>

              {/* Address Field */}
              <div className='form-control'>
<<<<<<< HEAD
                <label className='block mb-4'>
                  <span className='font-semibold text-gray-700 text-xl flex items-center gap-4'>
                    <MapPin className='size-6 text-emerald-600' />
=======
                <label className='label'>
                  <span className='label-text font-medium flex items-center gap-2'>
                    <MapPin className='size-4' />
>>>>>>> cart
                    Address
                  </span>
                </label>
                {isEditing ? (
                  <textarea
<<<<<<< HEAD
                    className='w-full pl-12 pr-4 py-4 border-2 border-gray-200 bg-white rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 text-gray-800 text-lg placeholder-gray-500'
=======
                    className='textarea textarea-bordered'
>>>>>>> cart
                    value={tempData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    placeholder='Enter your address'
                  />
                ) : (
<<<<<<< HEAD
                  <p className='text-gray-800 text-xl pl-16'>{userData.address || 'Not provided'}</p>
                )}
              </div>

              {/* Role Field (Read-only) */}
              <div className='form-control'>
                <label className='block mb-4'>
                  <span className='font-semibold text-gray-700 text-xl'>Account Role</span>
                </label>
                <div className='bg-gradient-to-r from-emerald-600 to-emerald-800 text-white px-6 py-3 rounded-2xl text-lg font-semibold inline-block'>
=======
                  <p className='text-base-content'>{userData.address || 'Not provided'}</p>
                )}
              </div>

              {/* Role Field */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium'>Role</span>
                </label>
                <div className='badge badge-primary badge-lg'>
>>>>>>> cart
                  {userData.role || 'User'}
                </div>
              </div>

<<<<<<< HEAD
              {/* Account Created Date (Read-only) */}
              <div className='form-control'>
                <label className='block mb-4'>
                  <span className='font-semibold text-gray-700 text-xl flex items-center gap-4'>
                    <Calendar className='size-6 text-emerald-600' />
                    Member Since
                  </span>
                </label>
                <p className='text-gray-600 text-xl pl-16'>
                  {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'N/A'}
=======
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
>>>>>>> cart
                </p>
              </div>
            </div>

<<<<<<< HEAD
            {/* Account Actions Section (Visible only when not editing) */}
            {!isEditing && (
              <div className='mt-16 pt-8 border-t border-gray-200'>
                <h3 className='text-2xl font-semibold text-gray-800 mb-8'>Account Actions</h3>
                <div className='space-y-4'>
                  {/* Change Password Button */}
                  <button 
                    className='btn border-2 border-emerald-500 text-emerald-600 bg-transparent hover:bg-emerald-50 w-full justify-start gap-4 py-5 text-xl rounded-2xl transition-all duration-300 flex items-center min-h-[72px] pl-6'
                    onClick={() => setShowChangePassword(true)}
                  >
                    <Key className="size-6" />
                    Change Password
                  </button>
                  {/* Delete Account Button */}
                  <button 
                    className='btn border-2 border-red-500 text-red-600 bg-transparent hover:bg-red-50 w-full justify-start gap-4 py-5 text-xl rounded-2xl transition-all duration-300 flex items-center min-h-[72px] pl-6'
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="size-6" />
=======
            {/* Additional Sections */}
            {!isEditing && (
              <div className='mt-8 pt-6 border-t border-base-300'>
                <h3 className='text-lg font-semibold text-base-content mb-4'>Account Actions</h3>
                <div className='space-y-2'>
                  <button 
                    className='btn btn-outline btn-primary btn-sm w-full justify-start gap-2'
                    onClick={() => setShowChangePassword(true)}
                  >
                    <Key className="size-4" />
                    Change Password
                  </button>
                  <button className='btn btn-outline btn-warning btn-sm w-full justify-start'>
                    Download Data
                  </button>
                  <button 
                    className='btn btn-outline btn-error btn-sm w-full justify-start gap-2'
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="size-4" />
>>>>>>> cart
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
<<<<<<< HEAD

        {/* Security Trust Badge */}
        <div className="text-center mt-8 text-gray-600 text-lg">
          <p>🔒 Your personal information is secure and encrypted</p>
        </div>
=======
>>>>>>> cart
      </div>
    </div>
  );
};

export default ProfilePage;