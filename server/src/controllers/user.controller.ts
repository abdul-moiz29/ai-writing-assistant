import { Request, Response } from 'express';
import { ApiError } from '../middleware/errorHandler';
import User, { IUser } from '../models/user.model';

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

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Fetch user from database
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response using destructuring
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
};

export const updateUserCredits = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { credits } = req.body;

    if (typeof credits !== 'number' || credits < 0) {
      return res.status(400).json({ error: 'Invalid credits value' });
    }

    // Fetch and update user credits
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.credits = credits;
    await user.save();

    // Remove password from response using destructuring
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user credits' });
  }
};




