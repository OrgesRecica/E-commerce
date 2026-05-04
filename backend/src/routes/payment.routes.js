import { Router } from 'express';
import { createIntent, webhook } from '../controllers/payment.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validateSchema } from '../middleware/validate.js';
import { createPaymentIntentSchema } from '../validations/schemas.js';

const router = Router();

router.post('/intent', requireAuth, validateSchema(createPaymentIntentSchema), createIntent);
router.post('/webhook', webhook);

export default router;
