import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: `${API_URL}/api/f1data`
});

// Add authorization header if token exists
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('f1Token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const f1Service = {
  // Get active session data
  getActiveSession: async () => {
    try {
      const response = await api.get('/active-session');
      return response.data;
    } catch (error) {
      console.error('Error fetching active session:', error);
      throw error;
    }
  },
  
  // Get live timing data
  getLiveTiming: async () => {
    try {
      const response = await api.get('/live-timing');
      return response.data;
    } catch (error) {
      console.error('Error fetching live timing:', error);
      throw error;
    }
  },
  
  // Get driver data
  getDriver: async (driverId) => {
    try {
      const response = await api.get(`/driver/${driverId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching driver ${driverId}:`, error);
      throw error;
    }
  },
  
  // Get all drivers
  getAllDrivers: async () => {
    try {
      const response = await api.get('/drivers');
      return response.data;
    } catch (error) {
      console.error('Error fetching all drivers:', error);
      throw error;
    }
  },
  
  // Get driver standings
  getDriverStandings: async () => {
    try {
      const response = await api.get('/standings/drivers');
      return response.data;
    } catch (error) {
      console.error('Error fetching driver standings:', error);
      throw error;
    }
  },
  
  // Get session results
  getSessionResults: async (sessionId) => {
    try {
      const response = await api.get(`/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching session ${sessionId} results:`, error);
      throw error;
    }
  },
  
  // Compare drivers
  compareDrivers: async (drivers, sessionId, statType = 'lapTimes') => {
    try {
      const response = await api.get('/compare', {
        params: {
          drivers: drivers.join(','),
          sessionId,
          statType
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing drivers:', error);
      throw error;
    }
  },
  
  // Get race calendar
  getRaceCalendar: async () => {
    try {
      const response = await api.get('/calendar');
      return response.data;
    } catch (error) {
      console.error('Error fetching race calendar:', error);
      throw error;
    }
  }
};

export default f1Service;