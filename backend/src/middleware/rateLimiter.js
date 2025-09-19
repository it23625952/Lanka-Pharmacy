import rateLimit from "../config/upstash.js";

/**
 * Express middleware for rate limiting using Upstash Redis.
 * Tracks requests by client IP address and returns HTTP 429 when limit is exceeded.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} Either proceeds to next middleware or returns rate limit error
 */
const rateLimiter = async (req, res, next) => {
    try {
        // Check if client has exceeded rate limit using their IP address
        const { success } = await rateLimit.limit(req.ip);

        if (!success) {
            return res.status(429).json({ message: "Too many requests" });
        }

        next();
    } catch (error) {
        console.error("Rate limiting error: ", error);
        next(error); // Pass error to Express error handling middleware
    }
}

export default rateLimiter;