const axios = require('axios');

class F1ApiService {
  constructor() {
    this.baseUrl = 'https://api.openf1.org/v1';
    this.axios = axios.create({
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'F1DashboardApp/1.0'
      }
    });
  }

  async getLiveTiming() {
    try {
      // First get a valid session to use
      const sessionsResponse = await this.axios.get(`${this.baseUrl}/sessions`);
      
      // Find the most recent session
      const sessions = sessionsResponse.data;
      if (!sessions || sessions.length === 0) {
        throw new Error('No sessions available');
      }
      
      // Sort sessions by date (most recent first)
      const sortedSessions = sessions.sort((a, b) => 
        new Date(b.date_start) - new Date(a.date_start)
      );
      
      const recentSession = sortedSessions[0];
      const sessionKey = recentSession.session_key;
      
      // Now get timing data with the session key
      const response = await this.axios.get(`${this.baseUrl}/timing`, {
        params: { session_key: sessionKey }
      });
      
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error('Timeout fetching live timing data');
        return { error: 'Timeout', message: 'Data request timed out' };
      }
      console.error('Error fetching live timing data:', error);
      
      // Return mock data when API fails
      return this.getMockTimingData();
    }
  }

  getMockTimingData() {
    // Return mock data to prevent app from breaking
    return {
      mock: true,
      entries: [
        { driver_number: '1', position: '1', last_lap_time_ms: 93456, gap_to_leader: '0.000' },
        { driver_number: '44', position: '2', last_lap_time_ms: 93789, gap_to_leader: '1.234' },
        { driver_number: '16', position: '3', last_lap_time_ms: 94123, gap_to_leader: '2.345' }
      ]
    };
  }

  // ... other methods remain the same
}

module.exports = new F1ApiService();