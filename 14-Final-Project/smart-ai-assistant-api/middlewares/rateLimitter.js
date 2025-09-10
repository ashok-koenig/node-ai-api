const rateLimit = require('express-rate-limit')

exports.rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
    message: 'Too many requests, please try again later'
})