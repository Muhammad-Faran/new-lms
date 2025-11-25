import axios from 'axios';
import { showMessageAlert } from './alert';

// Set default options for Axios
axios.defaults.baseURL = '/api'; // Use Vite's proxy to forward requests to the backend

// Add a request interceptor
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token'); // Get token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
        }

        return config; // Return the modified config
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axios.interceptors.response.use(
    (response) => {
        return response; // Pass successful responses through
    },
    (error) => {

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token'); // Clear stored token

            showMessageAlert({ message: error.response?.data?.message || 'Something went wrong', type: 'error' });

            setTimeout(() => {
                window.location = '/login'; // Redirect to login
            }, 1000);
        }

        return Promise.reject(error);
    }
);

export default axios;
