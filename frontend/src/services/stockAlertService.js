import api from './api';

export const subscribe = (productId, email) => api.post('/stock-alert/subscribe', { productId, email });
