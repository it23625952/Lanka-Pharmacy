import React from 'react';
import { Link } from 'react-router';
import { PlusIcon } from 'lucide-react';

/**
 * Main navigation header component for the Lanka Pharmacy application.
 * Provides branding and primary navigation actions.
 * 
 * @returns {JSX.Element} The rendered navigation bar component
 */
const Navbar = () => {
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
            
            {/* Primary action button - Create New Product */}
            <Link
              to="/create-product"
              className="btn btn-primary btn-sm sm:btn-md gap-2"
              aria-label="Create new product"
            >
              <PlusIcon className="size-4 sm:size-5" />
              {/* Text hidden on mobile for space conservation */}
              <span className="hidden sm:inline">
                New Product
              </span>
            </Link>

            {/* Reserved space for future user profile/avatar component */}
            {/* <UserProfileDropdown /> */}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;