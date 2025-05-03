import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router = Router();

// Test route
router.get('/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is working correctly',
    timestamp: new Date().toISOString()
  });
});

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/users', userRoutes);

export default router; 