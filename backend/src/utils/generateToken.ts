import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  role: string;
}

export const generateToken = (user: { _id: string; role: string }): string => {
  return jwt.sign(
    { 
      userId: user._id,
      role: user.role 
    }, 
    process.env.JWT_SECRET || 'secret', 
    {
      expiresIn: '7d',
    }
  );
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret') as TokenPayload;
  } catch (error) {
    return null;
  }
};
