import express from 'express';
import { updateProfile, changePassword } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();
router.use(protect);
router.put('/profile', updateProfile);
router.put('/password', changePassword);

export default router;
