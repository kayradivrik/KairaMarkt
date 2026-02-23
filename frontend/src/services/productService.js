import api from './api';

const params = (p) => {
  const search = new URLSearchParams();
  Object.entries(p || {}).forEach(([k, v]) => v != null && v !== '' && search.set(k, v));
  return search.toString();
};

export const getProducts = (query) => api.get(`/products?${params(query)}`);
export const getProductBySlug = (slug) => api.get(`/products/slug/${slug}`);
export const getProductById = (id) => api.get(`/products/${id}`);
export const getCategories = () => api.get('/products/categories');
export const getBrands = () => api.get('/products/brands');
