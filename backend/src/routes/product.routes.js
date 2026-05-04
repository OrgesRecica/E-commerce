import { Router } from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validateSchema } from '../middleware/validate.js';
import {
  createProductSchema,
  listProductsSchema,
  productIdSchema,
  productSlugSchema,
  updateProductSchema,
} from '../validations/schemas.js';

const router = Router();

router.get('/', validateSchema(listProductsSchema), listProducts);
router.get('/:slug', validateSchema(productSlugSchema), getProduct);

router.post(
  '/',
  requireAuth,
  requireAdmin,
  upload.array('images', 5),
  validateSchema(createProductSchema),
  createProduct
);
router.put('/:id', requireAuth, requireAdmin, validateSchema(updateProductSchema), updateProduct);
router.delete('/:id', requireAuth, requireAdmin, validateSchema(productIdSchema), deleteProduct);

export default router;
