const rateLimiter = require("express-rate-limit");
const { StandardValidation } = require("express-validator/lib/context-items");

// Login Rate Limiter
const loginLimiter = rateLimiter({

    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 5,
    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Create / Update / Delete
const writeLimiter = rateLimiter({
    windowMs: 60 * 60 * 1000, // 60 Minutes
    max: 50,
    message: {
        success: false,
        message: "Too many write requests. Try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Read APIs
const readLimiter = rateLimiter({
    windowMs: 60 * 60 * 1000, // 60 Minutes
    max: 200,
    message: {
        success: false,
        message: "Too many requests. Try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});



module.exports = {
    loginLimiter,
    writeLimiter,
    readLimiter,
};