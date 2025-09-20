import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import ProfilePage from './pages/ProfilePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import CreateProductPage from './pages/CreateProductPage'
import ProductDetailPage from './pages/ProductDetailPage'
import toast from 'react-hot-toast'

/**
 * Main application component that defines the routing structure.
 * Sets up all the route paths and their corresponding page components.
 * 
 * @returns {JSX.Element} The application routing structure
 */
const App = () => {
  return (
    <div>
      {/* Application routing configuration */}
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
      </Routes>
    </div>
  )
}

export default App;