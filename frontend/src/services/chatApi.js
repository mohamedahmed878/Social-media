import apiClient from './apiClient';

export const getConversations = () => apiClient.get('/conversations').then((r) => r.data);
export const startConversation = (userId) =>
  apiClient.post('/conversations', { userId }).then((r) => r.data);
export const getMessages = (conversationId) =>
  apiClient.get(`/conversations/${conversationId}/messages`).then((r) => r.data);
export const sendMessage = (payload) => apiClient.post('/messages', payload).then((r) => r.data);
export const markConversationRead = (conversationId) =>
  apiClient.put(`/conversations/${conversationId}/read`).then((r) => r.data);
export const sendTypingSignal = (conversationId, isTyping) =>
  apiClient.post(`/conversations/${conversationId}/typing`, { isTyping }).then((r) => r.data);
