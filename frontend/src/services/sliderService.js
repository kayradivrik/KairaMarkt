import api from './api';

export const getActiveSlides = () => api.get('/sliders');
