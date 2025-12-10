import express from 'express';
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart } from '../controllers/cartController';
import authenticateToken from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getCart);
router.post('/add', authenticateToken, addToCart);
router.post('/remove', authenticateToken, removeFromCart);
router.post('/update', authenticateToken, updateCartItem);
router.post('/clear', authenticateToken, clearCart);

export default router;
