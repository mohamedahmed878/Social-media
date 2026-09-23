import apiClient from './apiClient';

export const getMyGroups = () => apiClient.get('/groups').then((r) => r.data);
export const createGroup = (data) => apiClient.post('/groups', data).then((r) => r.data);
export const addGroupMembers = (id, memberIds) =>
  apiClient.put(`/groups/${id}/members`, { memberIds }).then((r) => r.data);
