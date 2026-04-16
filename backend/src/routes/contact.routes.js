import { Router } from 'express';
import { body } from 'express-validator';
import { createMessage } from '../controllers/contact.controller.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/',
  body('name').isString().trim().notEmpty(),
  body('email').isEmail(),
  body('message').isString().trim().notEmpty(),
  validate,
  createMessage
);

export default router;
