import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UploadPrescriptionPage from './pages/UploadPrescriptionPage';
import UploadSuccessPage from './pages/UploadSuccessPage';

// Customer Pages
import CustomerPrescriptionsPage from './pages/CustomerPrescriptionsPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';

// Product Pages
import ProductDetailPage from './pages/ProductDetailPage';
import CreateProductPage from "./pages/CreateProductPage";
import EditProductPage from "./pages/EditProductPage";

// Staff Management Pages
import Dashboard from "./pages/Dashboard";
import StaffList from "./pages/StaffList";
import AddStaff from "./pages/AddStaff";
import EditStaff from "./pages/EditStaff";
import StaffProfile from "./pages/StaffProfile";
import Roles from "./pages/Roles";
import Attendance from "./pages/Attendance";
import Salary from "./pages/Salary";
import Reports from "./pages/Reports";

// Pharmacy Staff Pages
import StaffPrescriptionsPage from './pages/StaffPrescriptionsPage';
import StaffOrdersPage from './pages/StaffOrdersPage';

// Shopping Cart Pages
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ViewOrderPage from './pages/ViewOrderPage';
import EditOrderPage from './pages/EditOrderPage';

// Waste Management
import WasteDashboard from './pages/WasteDashboard';

// Help & Support Pages - Customer Side
import HelpsupportPage from './pages/HelpsupportPage';
import TicketsPage from './pages/TicketsPage';
import ChatPage from './pages/ChatPage';
import FeedbackPage from './pages/FeedbackPage';
import CallbackPage from './pages/CallbackPage';

// Help & Support Pages - Staff/Agent Side
import AgentDashboardPage from './pages/AgentDashboardPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import AgentChatPage from './pages/AgentChatPage';

/**
 * Main application component defining the complete routing structure
 * for Lanka Pharmacy Management System
 */
function App() {
  return (
    <div>
      <Routes>
        {/* ================================================ */}
        {/* PUBLIC ROUTES */}
        {/* ================================================ */}
        
        <Route path="/" element={<HomePage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/signIn" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/upload-prescription" element={<UploadPrescriptionPage />} />
        <Route path="/upload-success" element={<UploadSuccessPage />} />
        
        
        {/* ================================================ */}
        {/* AUTHENTICATED USER ROUTES */}
        {/* ================================================ */}
        
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-prescriptions" element={<CustomerPrescriptionsPage />} />
        <Route path="/my-orders" element={<CustomerOrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        
        
        {/* ================================================ */}
        {/* PRODUCT MANAGEMENT ROUTES */}
        {/* ================================================ */}
        
        <Route path="/create-product" element={<CreateProductPage />} />
        <Route path="/edit-product/:id" element={<EditProductPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        
        
        {/* ================================================ */}
        {/* HELP & SUPPORT ROUTES - CUSTOMER SIDE */}
        {/* ================================================ */}
        
        {/* Main Help & Support Hub */}
        <Route path="/help-support" element={<HelpsupportPage />} />
        
        {/* Customer Support Features */}
        <Route path="/help-support/tickets" element={<TicketsPage />} />
        <Route path="/help-support/chat" element={<ChatPage />} />
        <Route path="/help-support/chat/:ticketId" element={<ChatPage />} />
        <Route path="/help-support/feedback" element={<FeedbackPage />} />
        <Route path="/help-support/callback" element={<CallbackPage />} />
        
        
        {/* ================================================ */}
        {/* HELP & SUPPORT ROUTES - STAFF/AGENT SIDE */}
        {/* ================================================ */}
        
        {/* Agent Dashboard - For Support Agents & Staff */}
        <Route 
          path="/agent/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Owner', 'Manager', 'Staff', 'Support Agent']}>
              <AgentDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Agent Chat - For Live Chat with Customers */}
        <Route 
          path="/agent/chat/:ticketID" 
          element={
            <ProtectedRoute allowedRoles={['Owner', 'Manager', 'Staff', 'Support Agent']}>
              <AgentChatPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Staff Dashboard - For Pharmacy Staff Analytics */}
        <Route 
          path="/staff/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Owner', 'Manager', 'Staff']}>
              <StaffDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        
        {/* ================================================ */}
        {/* STAFF MANAGEMENT ROUTES */}
        {/* ================================================ */}
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/staff" element={<StaffList />} />
        <Route path="/staff/add" element={<AddStaff />} />
        <Route path="/staff/edit/:id" element={<EditStaff />} />
        <Route path="/staff/:id" element={<StaffProfile />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/salary" element={<Salary />} />
        <Route path="/reports" element={<Reports />} />
        
        
        {/* ================================================ */}
        {/* PHARMACY STAFF PROTECTED ROUTES */}
        {/* ================================================ */}
        
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
        
        
        {/* ================================================ */}
        {/* SHOPPING CART & CHECKOUT ROUTES */}
        {/* ================================================ */}
        
        <Route path="/cart" element={<CartPage />} />
        <Route path="/cart-page" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/view-order/:id" element={<ViewOrderPage />} />
        <Route path="/edit-order/:id" element={<EditOrderPage />} />
        
        
        {/* ================================================ */}
        {/* WASTE MANAGEMENT ROUTE */}
        {/* ================================================ */}
        
        <Route path="/waste-dashboard" element={<WasteDashboard />} />
        
        
        {/* ================================================ */}
        {/* DEFAULT ROUTE - REDIRECT TO HOME */}
        {/* ================================================ */}
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
