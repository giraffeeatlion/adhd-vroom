// src/lib/api.ts

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// This interceptor adds the token to every REQUEST
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ADD THIS NEW INTERCEPTOR for RESPONSES
api.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  (error) => {
    // Check if the error is an auth error (401 or 403)
    if (error.response && [401, 403].includes(error.response.status)) {
      console.log("Authentication error, logging out...");
      // Remove the expired token
      localStorage.removeItem('authToken');
      // Redirect to the login page
      window.location.href = '/'; 
    }
    // For all other errors, just pass them along
    return Promise.reject(error);
  }
);

export default api;