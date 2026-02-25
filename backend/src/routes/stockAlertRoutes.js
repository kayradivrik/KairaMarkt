import express from 'express';
import { create } from '../controllers/stockAlertController.js';
import { protect, adminOnly } from '../middlewares/auth.js';
import StockAlert from '../models/StockAlert.js';

const router = express.Router();
router.post('/subscribe', create);

router.get('/list', protect, adminOnly, async (_req, res, next) => {
  try {
    const list = await StockAlert.find().populate('product', 'name slug').sort({ createdAt: -1 }).lean();
    res.json({ success: true, list });
  } catch (err) {
    next(err);
  }
});

export default router;
