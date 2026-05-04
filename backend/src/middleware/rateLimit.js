import rateLimit from 'express-rate-limit';
import { logSecurityEvent } from '../utils/securityLogger.js';

function limiter({ windowMs, limit, event, message }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler(req, res) {
      logSecurityEvent(event, req);
      res.status(429).json({ message });
    },
  });
}

export const apiRateLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.API_RATE_LIMIT_MAX || 600),
  event: 'api_rate_limited',
  message: 'Too many requests. Please try again later.',
});

export const loginRateLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.LOGIN_RATE_LIMIT_MAX || 20),
  event: 'login_rate_limited',
  message: 'Too many sign-in attempts. Please wait before trying again.',
});

export const authMutationRateLimiter = limiter({
  windowMs: 60 * 60 * 1000,
  limit: Number(process.env.AUTH_MUTATION_RATE_LIMIT_MAX || 30),
  event: 'auth_mutation_rate_limited',
  message: 'Too many account requests. Please try again later.',
});
