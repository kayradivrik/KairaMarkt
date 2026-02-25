import express from 'express';
import { subscribe } from '../controllers/newsletterController.js';
import { protect, adminOnly } from '../middlewares/auth.js';
import { list, remove } from '../controllers/newsletterController.js';

const router = express.Router();
router.post('/subscribe', subscribe);
router.get('/list', protect, adminOnly, list);
router.delete('/:id', protect, adminOnly, remove);

export default router;
