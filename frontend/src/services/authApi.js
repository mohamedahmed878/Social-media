import apiClient from './apiClient';

export const registerUser = (data) => apiClient.post('/auth/register', data).then((r) => r.data);
export const loginUser = (data) => apiClient.post('/auth/login', data).then((r) => r.data);
export const getMe = () => apiClient.get('/auth/me').then((r) => r.data);
export const logoutUser = () => apiClient.post('/auth/logout').then((r) => r.data);
