import { Router } from 'express';
import { createOrder, listMyOrders, getOrder, listAllOrders, updateOrderStatus, getStats } from '../controllers/order.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateSchema } from '../middleware/validate.js';
import { createOrderSchema, orderIdSchema, updateOrderStatusSchema } from '../validations/schemas.js';

const router = Router();

router.use(requireAuth);
router.post('/', validateSchema(createOrderSchema), createOrder);
router.get('/', listMyOrders);
router.get('/admin/all', requireAdmin, listAllOrders);
router.get('/admin/stats', requireAdmin, getStats);
router.patch('/:id/status', requireAdmin, validateSchema(updateOrderStatusSchema), updateOrderStatus);
router.get('/:id', validateSchema(orderIdSchema), getOrder);

export default router;
