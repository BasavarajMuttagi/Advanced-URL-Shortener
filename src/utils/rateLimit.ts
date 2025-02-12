import { Request } from "express";
import rateLimit from "express-rate-limit";

interface RateLimitConfig {
  windowMs?: number;
  max: number;
  message?: string;
  retryAfter?: number; // Made optional with ?
}

export const createRateLimiter = ({
  windowMs = 60 * 1000, // default 1 minute
  max,
  message = "Rate limit exceeded. Please try again later",
  retryAfter = 60, // default 60 seconds
}: RateLimitConfig) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 429,
      message,
      retryAfter, // Use the provided retryAfter value
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    keyGenerator: (req: Request) => req.ip || "",
  });
};

// Authentication endpoints
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many authentication attempts. Please try again later.",
  retryAfter: 900, // 15 minutes in seconds
});

// URL shortening endpoints
export const urlRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: "Too many URL shortening requests. Please try again later.",
  retryAfter: 60, // 1 minute in seconds
});
// analytics endpoints
export const analyticsRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 300, // 300 requests per 5 minutes (60 req/min average)
  message: "Too many analytics requests. Please try again later.",
  retryAfter: 300, // 5 minutes in seconds
});

export const basicRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: "Too many requests. Please wait before accessing URLs again.",
  retryAfter: 60,
});
