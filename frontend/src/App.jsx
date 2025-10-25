import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UploadPrescriptionPage from './pages/UploadPrescriptionPage';
import UploadSuccessPage from './pages/UploadSuccessPage';
import StaffPrescriptionsPage from './pages/StaffPrescriptionsPage';
import CustomerPrescriptionsPage from './pages/CustomerPrescriptionsPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import StaffOrdersPage from './pages/StaffOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import EditProductPage from "./pages/EditProductPage";

// Staff management
import Dashboard from "./pages/Dashboard";
import StaffList from "./pages/StaffList";
import AddStaff from "./pages/AddStaff";
import EditStaff from "./pages/EditStaff";
import StaffProfile from "./pages/StaffProfile";
import Roles from "./pages/Roles";
import Attendance from "./pages/Attendance";
import Salary from "./pages/Salary";
import Reports from "./pages/Reports";
import CreateProductPage from "./pages/CreateProductPage";

import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ViewOrderPage from './pages/ViewOrderPage';
import EditOrderPage from './pages/EditOrderPage';
import WasteDashboard from './pages/WasteDashboard';

function App() {
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

        <Route path="/create-product" element={<CreateProductPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* Staff routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/staff" element={<StaffList />} />
        <Route path="/staff/add" element={<AddStaff />} />
        <Route path="/staff/edit/:id" element={<EditStaff />} />
        <Route path="/staff/:id" element={<StaffProfile />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/salary" element={<Salary />} />
        <Route path="/reports" element={<Reports />} />

        <Route path="/create-product" element={<CreateProductPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
              
        {/* Shopping cart flow routes */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/cart-page" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        
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

        {/* Protected routes */}
        <Route
          path="/staff/prescriptions"
          element={
            <ProtectedRoute allowedRoles={["Owner","Manager","Staff"]}>
              <StaffPrescriptionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/orders"
          element={
            <ProtectedRoute allowedRoles={["Owner","Manager","Staff"]}>
              <StaffOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/orders/:id"
          element={
            <ProtectedRoute allowedRoles={["Owner","Manager","Staff"]}>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/" replace />} />
        // Add these routes in your Routes component
<Route path="/edit-product/:id" element={<EditProductPage />} />
<Route path="/create-product" element={<CreateProductPage />} />
<Route path="/product/:id" element={<ProductDetailPage />} />
<Route path="/waste-dashboard" element={<WasteDashboard />} />
      </Routes>
    </div>
  );
}

export default App;