import React from 'react';
import { Link, useNavigate } from 'react-router';
import { Plus, UserPlus, LogOut, LogIn, User, ShoppingCart, BarChart3 } from 'lucide-react';

/**
 * Main navigation header component for the Lanka Pharmacy application.
 * Provides branding and primary navigation actions with authentication state management.
 * 
 * @returns {JSX.Element} The rendered navigation bar component
 */
const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();

  /**
   * Handles user logout by removing token and redirecting to homepage
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/");
  };

  return (
    <header className="bg-base-100 border-b border-base-300 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Branding section with link to homepage */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary sm:text-3xl font-sans tracking-tight">
              Lanka Pharmacy
            </h1>
          </Link>

          {/* Navigation actions container */}
          <div className="flex items-center gap-3">
            
            {/* Show dashboard and cart links when signed in */}
            {isLoggedIn && (
              <>
                {/* Dashboard link - visible to all logged-in users */}
                <Link 
                  to="/" 
                  className="btn btn-ghost btn-sm sm:btn-md gap-2"
                  aria-label="View dashboard"
                >
                  <BarChart3 className="size-4 sm:size-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                {/* Shopping cart link */}
                <Link 
                  to="/" 
                  className="btn btn-ghost btn-sm sm:btn-md gap-2"
                  aria-label="View shopping cart"
                >
                  <ShoppingCart className="size-4 sm:size-5" />
                  <span className="hidden sm:inline">Cart</span>
                </Link>

                {/* User profile link */}
                <Link 
                  to="/profile" 
                  className="btn btn-ghost btn-sm sm:btn-md gap-2"
                  aria-label="View user profile"
                >
                  <User className="size-4 sm:size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </>
            )}

            {/* Primary action button - Create New Product (only for logged-in users) */}
            {isLoggedIn && (
              <Link 
                to="/create-product" 
                className="btn btn-primary btn-sm sm:btn-md gap-2" 
                aria-label="Create new product"
              >
                <Plus className="size-4 sm:size-5" />
                <span className="hidden sm:inline">New Product</span>
              </Link>
            )}

            {/* Authentication buttons */}
            {!isLoggedIn ? (
              <>
                {/* Sign In button */}
                <Link 
                  to="/signIn" 
                  className="btn btn-outline btn-sm sm:btn-md gap-2"
                  aria-label="Sign in to account"
                >
                  <LogIn className="size-4 sm:size-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>

                {/* Sign Up button */}
                <Link 
                  to="/signUp" 
                  className="btn btn-outline btn-secondary btn-sm sm:btn-md gap-2"
                  aria-label="Create new account"
                >
                  <UserPlus className="size-4 sm:size-5" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </>
            ) : (
              /* Log Out button when authenticated */
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-error btn-sm sm:btn-md gap-2"
                aria-label="Log out from account"
              >
                <LogOut className="size-4 sm:size-5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}

            {/* Reserved space for future user profile/avatar component */}
            {/* <UserProfileDropdown /> */}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;