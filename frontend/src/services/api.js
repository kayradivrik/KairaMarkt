import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

const RETRY_DELAY_429 = 2000;
const RETRY_DELAY_503 = 5000;
const MAX_RETRIES = 1;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const config = err.config;
    const status = err.response?.status;
    const retryCount = config.__retryCount ?? 0;

    if (retryCount < MAX_RETRIES && (status === 429 || status === 503)) {
      config.__retryCount = retryCount + 1;
      const delay = status === 429 ? RETRY_DELAY_429 : RETRY_DELAY_503;
      await new Promise((r) => setTimeout(r, delay));
      return api.request(config);
    }

    const msg = err.response?.data?.message || err.message || 'Bir hata oluştu';
    return Promise.reject(new Error(msg));
  }
);

export default api;
