import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";

/**
 * Express middleware for JWT authentication.
 * Verifies JWT token from Authorization header and attaches user data to request object.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Either proceeds to next middleware or returns authentication error
 */
const authenticate = async (req, res, next) => {
    try {
        // Extract token from Authorization header (format: "Bearer <token>")
        const token = req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Verify and decode JWT token using the configured secret
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach decoded user data to request object for downstream middleware
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

export default authenticate;