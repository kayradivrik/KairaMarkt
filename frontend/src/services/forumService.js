import api from './api';

export const getTopics = () => api.get('/forum/topics');
export const getTopicBySlug = (slug) => api.get(`/forum/topics/${slug}`);
export const createTopic = (data) => api.post('/forum/topics', data);
export const createPost = (data) => api.post('/forum/posts', data);
