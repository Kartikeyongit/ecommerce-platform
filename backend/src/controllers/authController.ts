import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User, { IUser } from '../models/User';
import { generateToken } from '../utils/generateToken';

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    await user.save();
    // Generate token with user object that includes role
    // Ensure user has a role, default to 'user' if not set
    const userRole = user.role || 'user';
    const token = generateToken({ _id: user._id.toString(), role: userRole });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: userRole,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token with user object that includes role
    // Ensure user has a role, default to 'user' if not set
    const userRole = user.role || 'user';
    const token = generateToken({ _id: user._id.toString(), role: userRole });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: userRole,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, address, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, address, phone },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error });
  }
};
