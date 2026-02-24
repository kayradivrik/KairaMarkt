import express from 'express';
import { protect, adminOnly } from '../middlewares/auth.js';
import upload, { uploadLogo as uploadLogoMiddleware } from '../middlewares/upload.js';
import {
  getDashboard,
  getSalesChart,
  getUsers,
  updateUserRole,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getAdminOrders,
  updateOrderStatus,
  getAdminReviews,
  deleteReview,
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getAdminLogs,
  getSliders,
  createSlider,
  updateSlider,
  deleteSlider,
  getSettings,
  updateSettings,
  uploadLogo as uploadLogoHandler,
} from '../controllers/adminController.js';

const router = express.Router();
router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/sales-chart', getSalesChart);
router.get('/logs', getAdminLogs);

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);

router.get('/products', getAdminProducts);
router.post('/products', upload.array('images', 10), createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.patch('/products/:id/stock', updateStock);

router.get('/orders', getAdminOrders);
router.patch('/orders/:id/status', updateOrderStatus);

router.get('/reviews', getAdminReviews);
router.delete('/reviews/:id', deleteReview);

router.get('/campaigns', getCampaigns);
router.post('/campaigns', createCampaign);
router.put('/campaigns/:id', updateCampaign);
router.delete('/campaigns/:id', deleteCampaign);

router.get('/sliders', getSliders);
router.post('/sliders', createSlider);
router.put('/sliders/:id', updateSlider);
router.delete('/sliders/:id', deleteSlider);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.post('/settings/logo', uploadLogoMiddleware.single('logo'), uploadLogoHandler);

export default router;
