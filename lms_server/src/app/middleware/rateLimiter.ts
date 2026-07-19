import { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";

// In-memory store — fine for the current single-instance Vercel deployment.
// If the backend ever scales to multiple instances, this needs a shared
// store (e.g. Redis) so limits are enforced across instances.
const rateLimitHandler = (message: string) => (req: Request, res: Response) => {
  res.status(429).json({
    success: false,
    message,
    data: null,
  });
};

export const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler(
    "Too many AI requests from this IP, please try again later.",
  ),
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler(
    "Too many login attempts from this IP, please try again later.",
  ),
});
