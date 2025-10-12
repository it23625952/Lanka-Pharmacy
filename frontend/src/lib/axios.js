import axios from 'axios';

// Create axios instance with base API configuration
const api = axios.create({
    baseURL: 'http://localhost:5001/api', // Base URL for all API requests
});

// Request interceptor to add authentication token to headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Add Bearer token to Authorization header
    }
    return config;
});

export default api;