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
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
        <Navbar />
        <div className='flex-1 flex items-center justify-center'>
          <div className='w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin'></div>
        </div>
      </div>
    );
  }

  return (
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
                      Cancel
                    </button>
                  </>
                ) : (
                  /* Edit Profile Button */
                  <button 
                    onClick={handleEditToggle}
                    className='btn border-2 border-white text-white bg-transparent hover:bg-white/10 gap-3 px-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center min-h-[52px]'
                  >
                    <Edit3 className='size-5' />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className='p-8'>
            <div className='space-y-8'>
              {/* Name Field */}
              <div className='form-control'>
                <label className='block mb-4'>
                  <span className='font-semibold text-gray-700 text-xl flex items-center gap-4'>
                    <User className='size-6 text-emerald-600' />
                    Full Name
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type='text'
                    className='w-full pl-12 pr-4 py-4 border-2 border-gray-200 bg-white rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 text-gray-800 text-lg'
                    value={tempData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
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
              </div>

              {/* Phone Field */}
              <div className='form-control'>
                <label className='block mb-4'>
                  <span className='font-semibold text-gray-700 text-xl flex items-center gap-4'>
                    <Phone className='size-6 text-emerald-600' />
                    Phone Number
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type='tel'
                    className='w-full pl-12 pr-4 py-4 border-2 border-gray-200 bg-white rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 text-gray-800 text-lg placeholder-gray-500'
                    value={tempData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder='Add phone number'
                  />
                ) : (
                  <p className='text-gray-800 text-xl pl-16'>{userData.phone || 'Not provided'}</p>
                )}
              </div>

              {/* Address Field */}
              <div className='form-control'>
                <label className='block mb-4'>
                  <span className='font-semibold text-gray-700 text-xl flex items-center gap-4'>
                    <MapPin className='size-6 text-emerald-600' />
                    Address
                  </span>
                </label>
                {isEditing ? (
                  <textarea
                    className='w-full pl-12 pr-4 py-4 border-2 border-gray-200 bg-white rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 text-gray-800 text-lg placeholder-gray-500'
                    value={tempData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    placeholder='Enter your address'
                  />
                ) : (
                  <p className='text-gray-800 text-xl pl-16'>{userData.address || 'Not provided'}</p>
                )}
              </div>

              {/* Role Field (Read-only) */}
              <div className='form-control'>
                <label className='block mb-4'>
                  <span className='font-semibold text-gray-700 text-xl'>Account Role</span>
                </label>
                <div className='bg-gradient-to-r from-emerald-600 to-emerald-800 text-white px-6 py-3 rounded-2xl text-lg font-semibold inline-block'>
                  {userData.role || 'User'}
                </div>
              </div>

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
                </p>
              </div>
            </div>

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
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Trust Badge */}
        <div className="text-center mt-8 text-gray-600 text-lg">
          <p>🔒 Your personal information is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;