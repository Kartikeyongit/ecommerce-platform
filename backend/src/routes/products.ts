import express from 'express';
import { getAllProducts, getProductById, searchProducts } from '../controllers/productController';
import authenticateToken from '../middleware/auth';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

export default router;
