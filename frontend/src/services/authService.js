import api, { setStoredToken } from './api';

export const register = (data) =>
  api.post('/auth/register', data).then((res) => {
    if (res.data?.token) setStoredToken(res.data.token);
    return res;
  });

export const login = (data) =>
  api.post('/auth/login', data).then((res) => {
    if (res.data?.token) setStoredToken(res.data.token);
    return res;
  });

export const logout = () =>
  api.post('/auth/logout').then((res) => {
    setStoredToken(null);
    return res;
  });

export const getMe = () => api.get('/auth/me');
