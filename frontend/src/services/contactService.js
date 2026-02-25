import api from './api';

export const submit = (data) => api.post('/contact/submit', data);
