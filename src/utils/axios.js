// src/utils/axios.js

import axios from 'axios';
import { getAuthToken } from './auth'; // Import getAuthToken to fetch the stored token

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Base API URL from .env file
});

// Add a request interceptor to include the token in every request
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken(); // Get the token from localStorage

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Attach token to Authorization header
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance; // Export the configured Axios instance
