import express from 'express';
import { submit } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middlewares/auth.js';
import { list, markRead, remove } from '../controllers/contactController.js';

const router = express.Router();
router.post('/submit', submit);
router.get('/list', protect, adminOnly, list);
router.patch('/:id/read', protect, adminOnly, markRead);
router.delete('/:id', protect, adminOnly, remove);

export default router;
