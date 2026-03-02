import api from './api';

export const getContentPage = (slug) => api.get(`/pages/${slug}`);

