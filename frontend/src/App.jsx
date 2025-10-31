import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Page components
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CreateProductPage from './pages/CreateProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';

import ViewOrderPage from './pages/ViewOrderPage';
import EditOrderPage from './pages/EditOrderPage';
import PaymentPage from './pages/PaymentPage';  
import PaymentSuccessPage from './pages/PaymentSuccessPage';

/**
 * Main application component that defines the routing structure.
 * Sets up all the route paths and their corresponding page components.
 *
 * @returns {JSX.Element} The application routing structure
 */
const App = () => {
  return (
    <div>
      <Routes>
        {/* Home page route - displays product dashboard */}
        <Route path="/" element={<HomePage />} />

        {/* User authentication routes */}
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/signIn" element={<SignInPage />} />

        {/* Password recovery routes */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* User profile management route */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Product management routes */}
        <Route path="/create-product" element={<CreateProductPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* Cart flow routes */}
        <Route path="/cart" element={<CartPage />} />
        
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/view-order" element={<ViewOrderPage />} />   {/* View order details */}
        <Route path="/edit-order" element={<EditOrderPage />} />   {/* Edit order details */}
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        {/* Fallback route for undefined paths */}
        <Route path="*" element={<h1 className="text-center">404 Page Not Found</h1>} />
      </Routes>
    </div>
  );
};

export default App;
