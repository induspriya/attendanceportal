import axios from 'axios';

// Create axios instance with base URL pointing to backend
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-domain.com' // Update this with your production backend URL
    : 'http://localhost:5001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// List of public endpoints that don't require authentication
const publicEndpoints = [
  '/api/holidays',
  '/api/holidays/upcoming',
  '/api/news/latest',
  '/api/news',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/health'
];

// Request interceptor to add auth token only for protected endpoints
api.interceptors.request.use(
  (config) => {
    // Check if this is a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url.includes(endpoint)
    );
    
    if (!isPublicEndpoint) {
      const token = localStorage.getItem('token');
      if (token) {
        // Validate token format before sending
        try {
          // Basic JWT format validation (3 parts separated by dots)
          if (token.split('.').length === 3) {
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            // Remove malformed token
            localStorage.removeItem('token');
            console.warn('Malformed token removed from localStorage');
          }
        } catch (error) {
          // Remove invalid token
          localStorage.removeItem('token');
          console.warn('Invalid token removed from localStorage');
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
