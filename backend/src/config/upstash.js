import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

/**
 * Rate limiter instance using Upstash Redis for distributed rate limiting.
 * Configures a sliding window of 100 requests per 60 seconds per client.
 * Environment variables are used for Redis connection configuration.
 */
const rateLimit = new Ratelimit({
    redis: Redis.fromEnv(), // Creates Redis client using environment variables
    limiter: Ratelimit.slidingWindow(100, "60s"), // 100 requests allowed per 60-second window
});

export default rateLimit;