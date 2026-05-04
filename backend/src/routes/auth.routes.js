import { Router } from 'express';
import {
  csrf,
  login,
  logout,
  me,
  refresh,
  register,
  resendVerification,
  verifyEmail,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { authMutationRateLimiter, loginRateLimiter } from '../middleware/rateLimit.js';
import { validateSchema } from '../middleware/validate.js';
import { loginSchema, registerSchema, verifyEmailSchema } from '../validations/schemas.js';

const router = Router();

router.get('/csrf', csrf);
router.post('/register', authMutationRateLimiter, validateSchema(registerSchema), register);
router.post('/login', loginRateLimiter, validateSchema(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.get('/verify-email/:token', validateSchema(verifyEmailSchema), verifyEmail);
router.post('/resend-verification', requireAuth, resendVerification);

export default router;
