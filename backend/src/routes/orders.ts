import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  createPaymentIntent,
  confirmPayment,
  updateOrderStatus,
  getAllOrdersAdmin,
} from '../controllers/orderController';
import authenticateToken, { requireAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, getOrders);
router.post('/payment-intent', authenticateToken, createPaymentIntent);
router.post('/confirm-payment', authenticateToken, confirmPayment);
router.get('/:id', authenticateToken, getOrderById);
router.put('/:id', authenticateToken, requireAdmin, updateOrderStatus);
router.get('/all', authenticateToken, requireAdmin, getAllOrdersAdmin);

export default router;
