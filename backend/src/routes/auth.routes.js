import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/register',
  body('name').isString().trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  validate,
  register
);

router.post('/login', body('email').isEmail(), body('password').notEmpty(), validate, login);
router.get('/me', requireAuth, me);

export default router;
