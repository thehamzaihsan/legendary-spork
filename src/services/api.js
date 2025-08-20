import axios from 'axios';

// Create an axios instance with default configuration
// In production, this will use the Vercel proxy
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`, // This will be your Vercel URL in production
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

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
