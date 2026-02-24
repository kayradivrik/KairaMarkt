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
export const getAdminOrders = (page = 1, limit = 10) => admin.get(`/admin/orders?page=${page}&limit=${limit}`);
export const updateOrderStatus = (id, status) => admin.patch(`/admin/orders/${id}/status`, { status });
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