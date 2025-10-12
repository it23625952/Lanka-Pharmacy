import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import api from '../lib/axios';

/**
 * ProtectedRoute component that handles authentication and role-based authorization.
 * Checks for valid JWT token and user permissions before rendering child components.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Array of role strings permitted to access the route
 * @returns {JSX.Element} Either the children components or redirect navigation
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    // Check authentication status and user profile on component mount
    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Fetch user profile to verify token validity and get user data
                const response = await api.get('/users/profile');
                setUser(response.data);
            } catch (error) {
                console.error('Auth check failed:', error);
                // Clear invalid token from storage
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [token]);

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Redirect to signin if no token or user data
    if (!token || !user) {
        return <Navigate to="/signin" replace />;
    }

    // Redirect to home page if user role is not in allowed roles
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // Render children if all checks pass
    return children;
}

export default ProtectedRoute;