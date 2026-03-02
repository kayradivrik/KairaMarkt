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
  getFaqList,
  createFaq,
  updateFaq,
  deleteFaq,
  duplicateProduct,
  bulkUpdateOrderStatus,
  exportOrdersCsv,
  getAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getStockReport,
  getCustomerSegments,
  getNotificationSettings,
  updateNotificationSettings,
  getShippingSettings,
  updateShippingSettings,
  getPaymentSettings,
  updatePaymentSettings,
  getContentPages,
  upsertContentPage,
  deleteContentPage,
  getSystemStatus,
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
router.patch('/orders/bulk-status', bulkUpdateOrderStatus);
router.get('/orders/export-csv', exportOrdersCsv);

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

router.get('/faq', getFaqList);
router.post('/faq', createFaq);
router.put('/faq/:id', updateFaq);
router.delete('/faq/:id', deleteFaq);

router.post('/products/:id/duplicate', duplicateProduct);

// Coupons
router.get('/coupons', getAdminCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Banners
router.get('/banners', getAdminBanners);
router.post('/banners', createBanner);
router.put('/banners/:id', updateBanner);
router.delete('/banners/:id', deleteBanner);

// Stock report
router.get('/stock-report', getStockReport);

// Customer segments
router.get('/customer-segments', getCustomerSegments);

// Notification settings
router.get('/notification-settings', getNotificationSettings);
router.put('/notification-settings', updateNotificationSettings);

// Shipping settings
router.get('/shipping-settings', getShippingSettings);
router.put('/shipping-settings', updateShippingSettings);

// Payment settings
router.get('/payment-settings', getPaymentSettings);
router.put('/payment-settings', updatePaymentSettings);

// Content pages
router.get('/content-pages', getContentPages);
router.post('/content-pages', upsertContentPage);
router.put('/content-pages', upsertContentPage);
router.delete('/content-pages/:id', deleteContentPage);

// System status
router.get('/system-status', getSystemStatus);

export default router;
