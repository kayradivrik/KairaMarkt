import express from 'express';
import { getActiveSlides } from '../controllers/sliderController.js';

const router = express.Router();
router.get('/', getActiveSlides);

export default router;
