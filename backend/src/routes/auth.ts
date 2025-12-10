import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import authenticateToken from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;
