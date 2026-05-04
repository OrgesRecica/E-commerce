import { Router } from 'express';
import { listUsers, updateMe } from '../controllers/user.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateSchema } from '../middleware/validate.js';
import { updateMeSchema } from '../validations/schemas.js';

const router = Router();

router.get('/', requireAuth, requireAdmin, listUsers);
router.patch('/me', requireAuth, validateSchema(updateMeSchema), updateMe);

export default router;
