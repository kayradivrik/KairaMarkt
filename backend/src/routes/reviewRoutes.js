import express from 'express';
import { getReviews, createReview, updateReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();
router.get('/:productId/reviews', getReviews);
router.post('/:productId/reviews', protect, createReview);
router.put('/:productId/reviews/:reviewId', protect, updateReview);
router.delete('/:productId/reviews/:reviewId', protect, deleteReview);

export default router;
