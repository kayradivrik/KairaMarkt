import api from './api';

const admin = api;

export const getDashboard = () => admin.get('/admin/dashboard');
export const getSalesChart = (days = 30) => admin.get(`/admin/sales-chart?days=${days}`);
export const getUsers = (page = 1, limit = 10) => admin.get(`/admin/users?page=${page}&limit=${limit}`);
export const updateUserRole = (id, role) => admin.put(`/admin/users/${id}/role`, { role });
export const getAdminProducts = (page = 1, limit = 10) => admin.get(`/admin/products?page=${page}&limit=${limit}`);
export const createProduct = (formData) => admin.post('/admin/products', formData);
export const updateAdminProduct = (id, data) => admin.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => admin.delete(`/admin/products/${id}`);
export const updateStock = (id, stock) => admin.patch(`/admin/products/${id}/stock`, { stock });
export const getAdminOrders = (page = 1, limit = 10, status = '') => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.set('status', status);
  return admin.get(`/admin/orders?${params}`);
};
export const updateOrderStatus = (id, status) => admin.patch(`/admin/orders/${id}/status`, { status });
export const bulkUpdateOrderStatus = (orderIds, status) => admin.patch('/admin/orders/bulk-status', { orderIds, status });
export const exportOrdersCsv = () => admin.get('/admin/orders/export-csv', { responseType: 'blob' });
export const getAdminReviews = (page = 1, limit = 10) => admin.get(`/admin/reviews?page=${page}&limit=${limit}`);
export const deleteReview = (id) => admin.delete(`/admin/reviews/${id}`);
export const getCampaigns = () => admin.get('/admin/campaigns');
export const createCampaign = (data) => admin.post('/admin/campaigns', data);
export const updateCampaign = (id, data) => admin.put(`/admin/campaigns/${id}`, data);
export const deleteCampaign = (id) => admin.delete(`/admin/campaigns/${id}`);
export const getAdminLogs = (page = 1, limit = 20) => admin.get(`/admin/logs?page=${page}&limit=${limit}`);
export const getSliders = () => admin.get('/admin/sliders');
export const createSlider = (data) => admin.post('/admin/sliders', data);
export const updateSlider = (id, data) => admin.put(`/admin/sliders/${id}`, data);
export const deleteSlider = (id) => admin.delete(`/admin/sliders/${id}`);
export const getSettings = () => admin.get('/admin/settings');
export const updateSettings = (data) => admin.put('/admin/settings', data);
export const uploadLogo = (formData) => admin.post('/admin/settings/logo', formData);
export const getFaqList = () => admin.get('/admin/faq');
export const createFaq = (data) => admin.post('/admin/faq', data);
export const updateFaq = (id, data) => admin.put(`/admin/faq/${id}`, data);
export const deleteFaq = (id) => admin.delete(`/admin/faq/${id}`);
export const duplicateProduct = (id) => admin.post(`/admin/products/${id}/duplicate`);

// Coupons
export const getAdminCoupons = () => admin.get('/admin/coupons');
export const createAdminCoupon = (data) => admin.post('/admin/coupons', data);
export const updateAdminCoupon = (id, data) => admin.put(`/admin/coupons/${id}`, data);
export const deleteAdminCoupon = (id) => admin.delete(`/admin/coupons/${id}`);

// Banners
export const getAdminBanners = () => admin.get('/admin/banners');
export const createAdminBanner = (data) => admin.post('/admin/banners', data);
export const updateAdminBanner = (id, data) => admin.put(`/admin/banners/${id}`, data);
export const deleteAdminBanner = (id) => admin.delete(`/admin/banners/${id}`);

// Stock report
export const getStockReport = () => admin.get('/admin/stock-report');

// Customer segments
export const getCustomerSegments = () => admin.get('/admin/customer-segments');

// Notification settings
export const getNotificationSettings = () => admin.get('/admin/notification-settings');
export const updateNotificationSettings = (data) => admin.put('/admin/notification-settings', data);

// Shipping settings
export const getShippingSettings = () => admin.get('/admin/shipping-settings');
export const updateShippingSettings = (data) => admin.put('/admin/shipping-settings', data);

// Payment settings
export const getPaymentSettings = () => admin.get('/admin/payment-settings');
export const updatePaymentSettings = (data) => admin.put('/admin/payment-settings', data);

// Content pages
export const getContentPages = () => admin.get('/admin/content-pages');
export const upsertContentPage = (data) => admin.post('/admin/content-pages', data);
export const deleteContentPage = (id) => admin.delete(`/admin/content-pages/${id}`);

// System status
export const getSystemStatus = () => admin.get('/admin/system-status');