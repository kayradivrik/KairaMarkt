import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  getCategories,
  getBrands,
} from '../controllers/productController.js';

const router = express.Router();
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

export default router;
