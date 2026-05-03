import { Router } from 'express';
import { createOrder, listMyOrders, getOrder, listAllOrders, updateOrderStatus, getStats } from '../controllers/order.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.post('/', createOrder);
router.get('/', listMyOrders);
router.get('/admin/all', requireAdmin, listAllOrders);
router.get('/admin/stats', requireAdmin, getStats);
router.patch('/:id/status', requireAdmin, updateOrderStatus);
router.get('/:id', getOrder);

export default router;
