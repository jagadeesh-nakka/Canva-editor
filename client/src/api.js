import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);

// Designs
export const createDesign = (designData) => api.post('/designs', designData);
export const getDesign = (id) => api.get(`/designs/${id}`);
export const updateDesign = (id, designData) => api.put(`/designs/${id}`, designData);
export const deleteDesign = (id) => api.delete(`/designs/${id}`);

// Comments
export const getComments = (designId) => api.get(`/comments/design/${designId}`);
export const addComment = (commentData) => api.post('/comments', commentData);
export const resolveComment = (commentId) => api.put(`/comments/${commentId}/resolve`);

export default api;