import api from './api';

export const getActiveCampaigns = () => api.get('/campaigns');
export const validateCoupon = (code, subtotal) => api.get(`/campaigns/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`);
