// config/jwt.js
import dotenv from 'dotenv';

// Load environment variables to access JWT_SECRET
dotenv.config();

/**
 * JWT secret key for signing tokens, loaded from environment variables
 * @type {string}
 */
export const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Default JWT token options including expiration time
 * @type {Object}
 */
export const JWT_OPTIONS = { expiresIn: '1d' }; // Tokens expire after 1 day

// Validate JWT secret configuration for production security
if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET is not configured in config/jwt.js');
    process.exit(1); // Terminate application if JWT secret is not set
}