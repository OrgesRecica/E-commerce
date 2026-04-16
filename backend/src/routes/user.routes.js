import { Router } from 'express';
import { listUsers, updateMe } from '../controllers/user.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, requireAdmin, listUsers);
router.patch('/me', requireAuth, updateMe);

export default router;
