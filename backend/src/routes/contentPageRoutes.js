import express from 'express';
import { getPageBySlug } from '../controllers/contentPageController.js';

const router = express.Router();

router.get('/:slug', getPageBySlug);

export default router;

