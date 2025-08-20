import axios from 'axios';

// Create an axios instance with default configuration
const isProduction = import.meta.env.PROD;

// In production, we use a relative path to ensure requests go to the Vercel proxy.
// In development, we use the .env variable.
const baseURL = isProduction ? '/api' : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

console.log('API Base URL:', baseURL);

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized
        console.error('Unauthorized access - please log in');
      } else if (error.response.status === 403) {
        // Handle forbidden
        console.error('You do not have permission to perform this action');
      } else if (error.response.status === 404) {
        // Handle not found
        console.error('The requested resource was not found');
      } else if (error.response.status >= 500) {
        // Handle server errors
        console.error('Server error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from server');
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Hangouts API
export const hangoutsApi = {
  // Get all hangouts
  getHangouts: async () => {
    try {
      const response = await api.get('/hangouts');
      return response.data;
    } catch (error) {
      console.error('Error fetching hangouts:', error);
      throw error;
    }
  },
  
  // Get a single hangout by ID
  getHangoutById: async (id) => {
    try {
      const response = await api.get(`/hangouts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hangout:', error);
      throw error;
    }
  },
  
  // Create a new hangout
  createHangout: async (hangoutData) => {
    try {
      const response = await api.post('/hangouts', hangoutData);
      return response.data;
    } catch (error) {
      console.error('Error creating hangout:', error);
      throw error;
    }
  },
  
  // Like a hangout
  likeHangout: async (id) => {
    try {
      const response = await api.put(`/hangouts/like/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error liking hangout:', error);
      throw error;
    }
  }
};

// WebRTC API
export const webRTCApi = {
  // Get TURN server credentials
  getTurnCredentials: async () => {
    try {
      const response = await api.get('/users/turnCredentials');
      return response.data;
    } catch (error) {
      console.error('Error fetching TURN credentials:', error);
      throw error;
    }
  },
  
  // Get user stats
  getUserStats: async () => {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }
};

export default api;
