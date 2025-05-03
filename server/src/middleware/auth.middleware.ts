import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler';
import User from '../models/user.model';

// JWT secret key - should be in .env in production
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new ApiError(401, 'You are not logged in. Please log in to get access.'));
    }

    const token = authHeader.split(' ')[1];

    // 2) Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return next(new ApiError(401, 'Invalid token. Please log in again.'));
    }

    if (!decoded?.userId) {
      return next(new ApiError(401, 'Invalid token. Please log in again.'));
    }

    // 3) Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new ApiError(401, 'The user belonging to this token no longer exists.'));
    }

    // 4) Grant access to protected route
    req.user = {
      userId: user._id.toString()
    };
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(401, 'Invalid token. Please log in again.'));
  }
}; 