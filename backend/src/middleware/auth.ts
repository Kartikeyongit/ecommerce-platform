import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/generateToken';
import User from '../models/User';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Get fresh user data to ensure role is up to date
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.userId = user._id.toString();
    req.userRole = user.role;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to authorize admin', error });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export default authenticateToken;
