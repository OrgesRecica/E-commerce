import { Router } from 'express';
import { createIntent, webhook } from '../controllers/payment.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/intent', requireAuth, createIntent);
router.post('/webhook', webhook);

export default router;
