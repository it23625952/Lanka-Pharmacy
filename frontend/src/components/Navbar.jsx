import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Plus, UserPlus, LogOut, LogIn, User, ShoppingCart, Upload, FileText, ClipboardList, Menu, X, Phone, Mail, Clock, Package, MessageCircle, Headphones } from 'lucide-react';
import api from '../lib/axios';
import Logo from './Logo.jpg';


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();


  // Handle scroll effect for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Fetch user data when logged in status changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);


  /**
   * Fetches user profile data from the API
   */
  const fetchUserData = async () => {
    try {
      setIsLoadingUser(true);
      const response = await api.get('/users/profile');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Clear token if it's invalid (unauthorized)
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setUserData(null);
      }
    } finally {
      setIsLoadingUser(false);
    }
  };


  /**
   * Handles user logout by clearing token and redirecting
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData(null);
    navigate("/");
  };


  /**
   * Generates user initials for avatar display
   * @returns {string} User initials (max 2 characters)
   */
  const getUserInitials = () => {
    if (!userData?.name) return 'U';
    return userData.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  return (
    <>
      {/* Top Info Bar with contact information */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-sm gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="size-4" />
              <span>+94 51 222 5523</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Mail className="size-4" />
              <span>lp.hatton.sup@gmail.com</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Clock className="size-4" />
            <span>Open 24/7 - Emergency Services Available</span>
          </div>
        </div>
      </div>


      {/* Main Navigation Bar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Brand Section */}
            <Link to="/" className="flex items-center gap-4">
              <div className="p-2 rounded-xl shadow-lg">
                <img src={Logo} width="40" height="40" alt="Lanka Pharmacy Logo" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
                  Lanka Pharmacy
                </h1>
                <p className="text-xs text-gray-500">Your Trusted Healthcare Partner</p>
              </div>
            </Link>


            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/" className="px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 font-medium">
                Home
              </Link>
              <Link to="/" className="px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 font-medium">
                Products
              </Link>
              <Link to="/" className="px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 font-medium">
                Services
              </Link>
              
              {/* HELP & SUPPORT LINK */}
              <Link to="/help-support" className="px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 font-medium flex items-center gap-2">
                <Headphones className="size-4" />
                Help & Support
              </Link>
            </div>


            {/* Right Action Buttons and User Menu */}
            <div className="flex items-center gap-3">
              {/* Upload Prescription - Primary Call to Action */}
              <Link 
                to="/upload-prescription"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              >
                <Upload className="size-4" />
                <span>Upload Prescription</span>
              </Link>


              {/* Shopping Cart with Item Count */}
              <button className="relative p-2.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200">
                <ShoppingCart className="size-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                  0
                </span>
              </button>


              {/* User Menu for Authenticated Users */}
              {isLoggedIn ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {isLoadingUser ? '...' : getUserInitials()}
                    </div>
                    <span className="hidden md:inline font-medium">
                      {isLoadingUser ? 'Loading...' : userData?.name?.split(' ')[0] || 'Account'}
                    </span>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800 truncate">
                        {userData?.name || 'User Account'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {userData?.email || 'user@example.com'}
                      </p>
                    </div>
                    <div className="p-2">
                      
                      <Link to="/profile" className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 flex items-center gap-2">
                        <User className="size-4" />
                        My Profile
                      </Link>
                      <Link to="/my-prescriptions" className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 flex items-center gap-2">
                        <ClipboardList className="size-4" />
                        My Prescriptions
                      </Link>
                      <Link to="/my-orders" className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 flex items-center gap-2">
                        <Package className="size-4" />
                        My Orders
                      </Link>
                      
                      {/* HELP & SUPPORT - In User Dropdown */}
                      <Link to="/help-support" className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 flex items-center gap-2">
                        <Headphones className="size-4" />
                        Help & Support
                      </Link>
                      
                      {/* Staff Management Links - Only for authorized roles */}
                      {userData?.role && ['Owner', 'Manager', 'Staff'].includes(userData.role) && (
                        <>
                          <div className="border-t border-gray-100 my-2"></div>
                          <Link to="/staff/prescriptions" className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 flex items-center gap-2">
                            <ClipboardList className="size-4" />
                            Manage Prescriptions
                          </Link>
                          <Link to="/staff/orders" className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 flex items-center gap-2">
                            <Package className="size-4" />
                            Manage Orders
                          </Link>
                        </>
                      )}
                      
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 mt-2 border-t border-gray-100 flex items-center gap-2">
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Authentication Buttons for Non-Logged In Users */
                <>
                  <Link to="/signin" className="hidden md:flex items-center gap-2 px-5 py-2.5 border-2 border-emerald-600 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all duration-200 font-medium">
                    <LogIn className="size-4" />
                    Sign In
                  </Link>
                  <Link to="/signup" className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                    <UserPlus className="size-4" />
                    Sign Up
                  </Link>
                </>
              )}


              {/* Mobile Menu Toggle Button */}
              <button 
                className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>
        </div>


        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              <Link to="/" className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 font-medium">
                Home
              </Link>
              <Link to="/" className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 font-medium">
                Products
              </Link>
              <Link to="/" className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 font-medium">
                Services
              </Link>
              
              {/* HELP & SUPPORT - Mobile Menu */}
              <Link to="/help-support" className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 font-medium flex items-center gap-2">
                <Headphones className="size-4" />
                Help & Support
              </Link>
              
              {/* Mobile User Menu for Authenticated Users */}
              {isLoggedIn ? (
                <>
                  {userData && (
                    <div className="px-4 py-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="font-semibold text-gray-800">{userData.name}</p>
                      <p className="text-sm text-gray-600">{userData.email}</p>
                    </div>
                  )}
                  
                  <Link to="/profile" className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 font-medium">
                    My Profile
                  </Link>
                  <Link to="/my-prescriptions" className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 font-medium">
                    My Prescriptions
                  </Link>
                  <Link to="/my-orders" className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 flex items-center gap-2">
                    <Package className="size-4" />
                    My Orders
                  </Link>
                  
                  {userData?.role && ['Owner', 'Manager', 'Staff'].includes(userData.role) && (
                    <>
                      <Link to="/staff/prescriptions" className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 flex items-center gap-2">
                        <ClipboardList className="size-4" />
                        Manage Prescriptions
                      </Link>
                      <Link to="/staff/orders" className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 flex items-center gap-2">
                        <Package className="size-4" />
                        Manage Orders
                      </Link>
                    </>
                  )}
                  
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                /* Mobile Authentication Buttons */
                <>
                  <Link to="/signin" className="block px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200 font-medium">
                    Sign In
                  </Link>
                  <Link to="/signup" className="block px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 rounded-lg transition-all duration-200 font-medium text-center">
                    Sign Up
                  </Link>
                </>
              )}
              
              {/* Mobile Upload Prescription Button */}
              <Link to="/upload-prescription" className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium mt-4 text-center flex items-center justify-center gap-2">
                <Upload className="size-4" />
                Upload Prescription
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};


export default Navbar;
