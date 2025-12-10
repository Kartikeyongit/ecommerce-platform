import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import authenticateToken, { requireAdmin } from '../middleware/auth';

const router = express.Router();

// All products for admin (same as normal list, but protected)
router.get('/', authenticateToken, requireAdmin, getAllProducts);

// Create / update / delete
router.post('/', authenticateToken, requireAdmin, createProduct);
router.put('/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

export default router;
