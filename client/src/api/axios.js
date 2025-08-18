import axios from 'axios';

// Create axios instance with base URL pointing to backend
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' // Use relative path for Vercel deployment
    : 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a fallback for when backend is not accessible
api.interceptors.request.use(
  (config) => {
    // Check if we're in production and backend might not be accessible
    if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL) {
      console.warn('Backend URL not configured. API calls may fail.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// List of public endpoints that don't require authentication
const publicEndpoints = [
  '/holidays',
  '/holidays/upcoming',
  '/news/latest',
  '/news',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/health'
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
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
