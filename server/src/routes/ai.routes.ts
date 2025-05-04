import express from 'express';
import { generateText } from '../controllers/ai.controller';
import { protect } from '../middleware/auth.middleware';
import AIGeneration from '../models/ai-generation.model';

const router = express.Router();

router.post('/generate', protect, generateText);

// GET /api/ai/history - fetch user's previous generations
router.get('/history', protect, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const generations = await AIGeneration.find({ user: userId })
      .sort({ createdAt: -1 });
    res.json({ generations });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

export default router; 