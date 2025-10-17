import React from 'react';
import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UploadPrescriptionPage from './pages/UploadPrescriptionPage';
import UploadSuccessPage from './pages/UploadSuccessPage';
import ProtectedRoute from './components/ProtectedRoute';
import StaffPrescriptionsPage from './pages/StaffPrescriptionsPage';
import CustomerPrescriptionsPage from './pages/CustomerPrescriptionsPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import StaffOrdersPage from './pages/StaffOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';

/**
 * Main application component defining the routing structure
 */
const App = () => {
  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/signIn" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/upload-prescription" element={<UploadPrescriptionPage />} />
        <Route path="/upload-success" element={<UploadSuccessPage />} />
        
        {/* Authenticated user routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-prescriptions" element={<CustomerPrescriptionsPage />} />
        <Route path="/my-orders" element={<CustomerOrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        
        {/* Staff protected routes */}
        <Route 
          path="/staff/prescriptions" 
          element={
            <ProtectedRoute allowedRoles={['Owner', 'Manager', 'Staff']}>
              <StaffPrescriptionsPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/staff/orders" 
          element={
            <ProtectedRoute allowedRoles={['Owner', 'Manager', 'Staff']}>
              <StaffOrdersPage />
            </ProtectedRoute>
          } 
        />
        
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