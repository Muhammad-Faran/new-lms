import axios from 'axios';

// Set Axios default configurations
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = true; // <-- Add this line

// Add the Authorization header if token is available
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default axios;
