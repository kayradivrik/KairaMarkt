import api from './api';

export const getReviews = (productId) => api.get(`/products/${productId}/reviews`);
export const createReview = (productId, data) => api.post(`/products/${productId}/reviews`, data);
export const updateReview = (productId, reviewId, data) => api.put(`/products/${productId}/reviews/${reviewId}`, data);
export const deleteReview = (productId, reviewId) => api.delete(`/products/${productId}/reviews/${reviewId}`);
