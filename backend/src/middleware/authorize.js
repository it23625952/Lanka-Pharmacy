import User from "../models/User.js";

/**
 * Express middleware factory for role-based authorization.
 * Checks if the authenticated user has one of the allowed roles.
 * 
 * @param {...string} allowedRoles - Spread of role strings that are permitted
 * @returns {Function} Express middleware function that validates user roles
 */
export const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Find user by ID from authenticated request
            const user = await User.findById(req.user.userId);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            // Check if user's role is in the allowed roles list
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ 
                    message: 'Access denied. Insufficient permissions.' 
                });
            }
            
            // Attach user role to request object for downstream middleware
            req.user.role = user.role;
            next();
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };
};