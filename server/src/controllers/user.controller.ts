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

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { name, currentPassword, newPassword } = req.body;
    if (!name && !newPassword) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update name if provided
    if (name) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Name is required' });
      }
      user.name = name.trim();
    }

    // Update password if provided
    if (newPassword) {
      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      if (!/[A-Z]/.test(newPassword)) {
        return res.status(400).json({ error: 'Password must contain at least one uppercase letter' });
      }
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      user.password = newPassword;
    }

    await user.save();
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
};




