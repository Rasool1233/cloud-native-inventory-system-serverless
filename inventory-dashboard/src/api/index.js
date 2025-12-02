import axios from 'axios';

// Get base URL from environment variables
// For Vite we expose this as VITE_REACT_APP_API_BASE to mirror the
// classic CRA-style REACT_APP_API_BASE while still following Vite's
// VITE_* naming convention.
const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_API_BASE ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://api.example.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (set during login)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear auth and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Return formatted error
      return Promise.reject({
        message: data.message || 'An error occurred',
        status,
        data,
      });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        message: 'Network error - please check your connection',
        status: 0,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0,
      });
    }
  }
);

export default apiClient;
