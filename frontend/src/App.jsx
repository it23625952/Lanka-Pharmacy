import React from 'react';
import { Route, Routes } from 'react-router';
import toast from 'react-hot-toast';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CreateProductPage from './pages/CreateProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import UploadPrescriptionPage from './pages/UploadPrescriptionPage';
import UploadSuccessPage from './pages/UploadSuccessPage';
import StaffPrescriptionsPage from './pages/StaffPrescriptionsPage';
import CustomerPrescriptionsPage from './pages/CustomerPrescriptionsPage';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import StaffOrdersPage from './pages/StaffOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';

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

        <Route path="/upload-prescription" element={<UploadPrescriptionPage />} />
        <Route path="/upload-success" element={<UploadSuccessPage />} />

        <Route 
          path="/staff/prescriptions" 
          element={
              <ProtectedRoute allowedRoles={['Owner', 'Manager', 'Staff']}>
                  <StaffPrescriptionsPage />
              </ProtectedRoute>
          } 
        />

        <Route path='/my-prescriptions' element={<CustomerPrescriptionsPage />} />

        <Route path="/my-orders" element={<CustomerOrdersPage />} />

        <Route 
          path="/staff/orders" 
          element={
            <ProtectedRoute allowedRoles={['Owner', 'Manager', 'Staff']}>
              <StaffOrdersPage />
            </ProtectedRoute>
          } 
        />

        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route 
          path="/staff/orders/:id" 
          element={
            <ProtectedRoute allowedRoles={['Owner', 'Manager', 'Staff']}>
              <OrderDetailPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  )
}

export default App;