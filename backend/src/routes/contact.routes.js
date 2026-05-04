import { Router } from 'express';
import { createMessage } from '../controllers/contact.controller.js';
import { validateSchema } from '../middleware/validate.js';
import { contactSchema } from '../validations/schemas.js';

const router = Router();

router.post('/', validateSchema(contactSchema), createMessage);

export default router;
