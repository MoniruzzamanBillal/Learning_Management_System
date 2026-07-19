"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLimiter = exports.aiLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
// In-memory store — fine for the current single-instance Vercel deployment.
// If the backend ever scales to multiple instances, this needs a shared
// store (e.g. Redis) so limits are enforced across instances.
const rateLimitHandler = (message) => (req, res) => {
    res.status(429).json({
        success: false,
        message,
        data: null,
    });
};
exports.aiLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler("Too many AI requests from this IP, please try again later."),
});
exports.loginLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler("Too many login attempts from this IP, please try again later."),
});
