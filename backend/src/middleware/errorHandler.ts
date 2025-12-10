import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.errors,
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate field value',
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
};
