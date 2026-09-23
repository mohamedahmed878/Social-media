import apiClient from './apiClient';

export const searchUsers = (search = '') =>
  apiClient.get('/users', { params: { search } }).then((r) => r.data);
export const getUserById = (id) => apiClient.get(`/users/${id}`).then((r) => r.data);
export const updateProfile = (data) => apiClient.put('/users/profile', data).then((r) => r.data);
export const addFriend = (id) => apiClient.post(`/users/${id}/friend`).then((r) => r.data);
