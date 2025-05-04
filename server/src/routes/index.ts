import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import aiRoutes from './ai.routes';
import stripeRoutes from './stripe.routes';

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
router.use('/ai', aiRoutes);
router.use('/stripe', stripeRoutes);

export default router; 