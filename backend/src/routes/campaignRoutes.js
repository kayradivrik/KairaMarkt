import express from 'express';
import { getActiveCampaigns, validateCoupon } from '../controllers/campaignController.js';

const router = express.Router();
router.get('/', getActiveCampaigns);
router.get('/validate', validateCoupon);

export default router;
