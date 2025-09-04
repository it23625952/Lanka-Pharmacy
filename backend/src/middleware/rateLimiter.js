import rateLimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await rateLimit.limit(req.ip);

        if (!success) {
            return res.status(429).json({ message: "Too many requests" });
        }

        next();
    } catch (error) {
        console.error("Rate limiting error: ", error);
        next(error);
    }
}

export default rateLimiter;