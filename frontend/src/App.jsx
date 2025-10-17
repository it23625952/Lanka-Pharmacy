import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// Public routes
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UploadPrescriptionPage from "./pages/UploadPrescriptionPage";
import UploadSuccessPage from "./pages/UploadSuccessPage";
import StaffPrescriptionsPage from "./pages/StaffPrescriptionsPage";
import CustomerPrescriptionsPage from "./pages/CustomerPrescriptionsPage";
import CustomerOrdersPage from "./pages/CustomerOrdersPage";
import StaffOrdersPage from "./pages/StaffOrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";

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
import ProductDetailPage from "./pages/ProductDetailPage";

function App() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 ml-80 bg-gray-100 min-h-screen">
        <main className="p-6">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/signUp" element={<SignUpPage />} />
            <Route path="/signIn" element={<SignInPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/upload-prescription" element={<UploadPrescriptionPage />} />
            <Route path="/upload-success" element={<UploadSuccessPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-prescriptions" element={<CustomerPrescriptionsPage />} />
            <Route path="/my-orders" element={<CustomerOrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />

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
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
