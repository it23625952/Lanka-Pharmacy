import React from 'react';
import { Route, Routes } from 'react-router-dom';
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



// ✅ HELP & SUPPORT PAGES
import HelpsupportPage from './pages/HelpsupportPage';
import TicketsPage from './pages/TicketsPage';
import ChatPage from './pages/ChatPage';
import FeedbackPage from './pages/FeedbackPage';
import CallbackPage from './pages/CallbackPage';
import AgentDashboardPage from './pages/AgentDashboardPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import AgentChatPage from './pages/AgentChatPage'; // ✅ ADD THIS IMPORT



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
        
        
        {/* 🎯 HELP & SUPPORT ROUTES - Customer Side */}
      
        {/* Main Help & Support Hub */}
        <Route path="/help-support" element={<HelpsupportPage />} />
        
        {/* Customer Support Features */}
        <Route path="/help-support/tickets" element={<TicketsPage />} />
        <Route path="/help-support/chat" element={<ChatPage />} />
        <Route path="/help-support/chat/:ticketId" element={<ChatPage />} />
        <Route path="/help-support/feedback" element={<FeedbackPage />} />
        <Route path="/help-support/callback" element={<CallbackPage />} />
        
        
        {/* 🎯 HELP & SUPPORT ROUTES - Staff/Agent Side */}
        
        {/* ✅ Agent Dashboard - For Support Agents & Staff */}
        <Route 
          path="/agent/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Owner', 'Manager', 'Staff', 'Support Agent']}>
              <AgentDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* ✅ Agent Chat - For Live Chat with Customers */}
        <Route 
          path="/agent/chat/:ticketID" 
          element={
            <ProtectedRoute allowedRoles={['Owner', 'Manager', 'Staff', 'Support Agent']}>
              <AgentChatPage />
            </ProtectedRoute>
          } 
        />
        
        {/* ✅ Staff Dashboard - For Pharmacy Staff (Owner, Manager, Staff) */}
        <Route 
          path="/staff/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Owner', 'Manager', 'Staff']}>
              <StaffDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        
        {/* PHARMACY STAFF PROTECTED ROUTES */}
        
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
