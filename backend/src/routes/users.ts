import express from 'express';
import { getAllUsers, getUserCount, updateUserRole, deleteUser } from '../controllers/userController';
import { getOrdersByUser } from '../controllers/orderController';
import authenticateToken, { requireAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, getAllUsers);
router.get('/count', authenticateToken, requireAdmin, getUserCount);
router.get('/:id/orders', authenticateToken, requireAdmin, getOrdersByUser);
router.put('/:id/role', authenticateToken, requireAdmin, updateUserRole);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

export default router;
