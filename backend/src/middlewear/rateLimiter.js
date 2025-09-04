import rateLimiter from "../config/upstash";

const rateLimit = async (req, res, next) => {
    try {
        const { success } = await rateLimit.limit("my-limit-key");

        if (!success) {
            return res.status(429).json({ message: "Too many requests, please try again later." });
        }

        next();
    } catch (error) {
        console.log("Rate Limiter Error:", error);
        next(error);
    }
};

export default rateLimit;