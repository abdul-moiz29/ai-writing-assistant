import { Router } from "express";
import { getUserProfile, updateUserCredits, updateUserProfile } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/me', getUserProfile);
router.patch('/credits', updateUserCredits);
router.patch('/profile', updateUserProfile);

export default router;