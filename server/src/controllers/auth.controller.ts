import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { ApiError } from '../middleware/errorHandler';
import { MongoError } from 'mongodb';

// JWT secret key - should be in .env in production
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Password validation
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ error: 'Password must contain at least one uppercase letter' });
        }

        // Create new user
        const user = await User.create({ email, password, name });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: '24h',
        });

        // Remove password from response using destructuring
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(201).json({
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        if (error instanceof MongoError && error.code === 11000) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        res.status(500).json({ error: 'Error creating user' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: '24h',
        });

        // Remove password from response using destructuring
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.json({
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Error getting user' });
    }
}; 