import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

export const getUserCount = async (req: AuthRequest, res: Response) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user count', error });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    const validRoles = ['user', 'admin'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role', error });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error });
  }
};
