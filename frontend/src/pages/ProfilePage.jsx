import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { User, Mail, Phone, MapPin, Edit3, Save, X, Calendar, Trash2, Key } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import ChangePasswordModal from '../components/ChangePasswordModal';
import DeleteAccountModal from '../components/DeleteAccountModal';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
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
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col'>
        <Navbar />
        <div className='flex-1 flex items-center justify-center'>
          <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col'>
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
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3'>User Profile</h1>
          <p className='text-gray-600 text-lg'>Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className='bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-600 to-blue-800 p-6'>
            <div className='flex justify-between items-center'>
              <h2 className='text-2xl font-bold text-white'>Personal Information</h2>
              <div className='flex gap-2'>
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSaveProfile}
                      className='btn bg-green-500 border-none text-white hover:bg-green-600 btn-sm gap-2 shadow-md hover:shadow-lg transition-all duration-200'
                    >
                      <Save className='size-4' />
                      Save
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className='btn border-2 border-gray-300 text-white bg-transparent hover:bg-gray-50 hover:text-gray-700 btn-sm gap-2 transition-all duration-200'
                    >
                      <X className='size-4' />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleEditToggle}
                    className='btn border-2 border-white text-white bg-transparent hover:bg-white/10 btn-sm gap-2 transition-all duration-200'
                  >
                    <Edit3 className='size-4' />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='p-8'>
            {/* Profile Information */}
            <div className='space-y-6'>
              {/* Name Field */}
              <div className='form-control'>
                <label className='label mb-2'>
                  <span className='label-text font-semibold text-gray-700 text-lg flex items-center gap-3'>
                    <User className='size-5 text-blue-600' />
                    Full Name
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type='text'
                    className='input input-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800'
                    value={tempData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <p className='text-gray-800 text-lg'>{userData.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className='form-control'>
                <label className='label mb-2'>
                  <span className='label-text font-semibold text-gray-700 text-lg flex items-center gap-3'>
                    <Mail className='size-5 text-blue-600' />
                    Email Address
                  </span>
                </label>
                <p className='text-gray-800 text-lg'>{userData.email}</p>
                <span className='text-sm text-gray-500 mt-1'>Email cannot be changed</span>
              </div>

              {/* Phone Field */}
              <div className='form-control'>
                <label className='label mb-2'>
                  <span className='label-text font-semibold text-gray-700 text-lg flex items-center gap-3'>
                    <Phone className='size-5 text-blue-600' />
                    Phone Number
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type='tel'
                    className='input input-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder-gray-500'
                    value={tempData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder='Add phone number'
                  />
                ) : (
                  <p className='text-gray-800 text-lg'>{userData.phone || 'Not provided'}</p>
                )}
              </div>

              {/* Address Field */}
              <div className='form-control'>
                <label className='label mb-2'>
                  <span className='label-text font-semibold text-gray-700 text-lg flex items-center gap-3'>
                    <MapPin className='size-5 text-blue-600' />
                    Address
                  </span>
                </label>
                {isEditing ? (
                  <textarea
                    className='textarea textarea-lg w-full border-2 border-gray-300 bg-gray-50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder-gray-500'
                    value={tempData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    placeholder='Enter your address'
                  />
                ) : (
                  <p className='text-gray-800 text-lg'>{userData.address || 'Not provided'}</p>
                )}
              </div>

              {/* Role Field */}
              <div className='form-control'>
                <label className='label mb-2'>
                  <span className='label-text font-semibold text-gray-700 text-lg'>Role</span>
                </label>
                <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-full text-sm font-semibold inline-block'>
                  {userData.role || 'User'}
                </div>
              </div>

              {/* Account Created Date */}
              <div className='form-control'>
                <label className='label mb-2'>
                  <span className='label-text font-semibold text-gray-700 text-lg flex items-center gap-3'>
                    <Calendar className='size-5 text-blue-600' />
                    Member Since
                  </span>
                </label>
                <p className='text-gray-600 text-lg'>
                  {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Additional Sections */}
            {!isEditing && (
              <div className='mt-12 pt-8 border-t border-gray-200'>
                <h3 className='text-xl font-semibold text-gray-800 mb-6'>Account Actions</h3>
                <div className='space-y-3'>
                  <button 
                    className='btn border-2 border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50 w-full justify-start gap-3 py-4 text-lg transition-all duration-200 flex items-center min-h-[64px]'
                    onClick={() => setShowChangePassword(true)}
                  >
                    <Key className="size-5" />
                    Change Password
                  </button>
                  <button 
                    className='btn border-2 border-red-500 text-red-600 bg-transparent hover:bg-red-50 w-full justify-start gap-3 py-4 text-lg transition-all duration-200 flex items-center min-h-[64px]'
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="size-5" />
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