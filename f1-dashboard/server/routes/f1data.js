const express = require('express');
const router = express.Router();
const axios = require('axios');

// Base URL for Open F1 API
const BASE_URL = 'https://api.openf1.org/v1';

// Get live timing data
router.get('/live-timing', async (req, res) => {
  try {
    // For now, return mock data as we're just setting up
    const mockData = {
      sessionId: '12345',
      entries: [
        { driverNumber: '44', position: '1', lastLapTime: '1:33.456', gap: '+0.000' },
        { driverNumber: '1', position: '2', lastLapTime: '1:33.789', gap: '+0.333' },
        { driverNumber: '16', position: '3', lastLapTime: '1:34.123', gap: '+0.667' }
      ]
    };
    res.json(mockData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching live timing data', error: error.message });
  }
});

// Get session results
router.get('/session/:sessionId', async (req, res) => {
  try {
    // For now, return mock data
    const mockResults = {
      sessionId: req.params.sessionId,
      results: [
        { position: 1, driverNumber: '44', timeMillis: 5823456 },
        { position: 2, driverNumber: '1', timeMillis: 5824321 },
        { position: 3, driverNumber: '16', timeMillis: 5825678 }
      ]
    };
    res.json(mockResults);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session results', error: error.message });
  }
});

// Get driver data
router.get('/driver/:driverId', async (req, res) => {
  try {
    // For now, return mock data
    const mockDriver = {
      driverId: req.params.driverId,
      fullName: `Driver ${req.params.driverId}`,
      code: req.params.driverId,
      team: { name: "Team Name", color: "#E10600" }
    };
    res.json(mockDriver);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching driver data', error: error.message });
  }
});

// Get driver results
router.get('/driver/:driverId/results', async (req, res) => {
  try {
    // For now, return mock data
    const mockResults = [
      { raceName: "Race 1", position: 1 },
      { raceName: "Race 2", position: 3 },
      { raceName: "Race 3", position: null }, // DNF
      { raceName: "Race 4", position: 2 },
      { raceName: "Race 5", position: 5 }
    ];
    res.json(mockResults);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching driver results', error: error.message });
  }
});

// Get lap times
router.get('/laptimes/:sessionId', async (req, res) => {
  try {
    // For now, return mock data
    const mockLapTimes = [];
    for (let lap = 1; lap <= 10; lap++) {
      mockLapTimes.push({
        lap_number: lap,
        driver_number: req.query.driverId || '44',
        lap_time: 93000 + (Math.random() * 2000 - 1000)
      });
    }
    res.json(mockLapTimes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lap time data', error: error.message });
  }
});

// Get active session
router.get('/active-session', async (req, res) => {
  try {
    // For now, return mock data
    const mockSession = {
      id: '12345',
      name: 'Monaco Grand Prix - Race',
      circuit_name: 'Circuit de Monaco',
      date: '2023-05-28T13:00:00Z',
      status: 'Active'
    };
    res.json(mockSession);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active session data', error: error.message });
  }
});

// Compare drivers
router.get('/compare', async (req, res) => {
  try {
    const { drivers, sessionId } = req.query;
    
    if (!drivers || !sessionId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    const driverIds = drivers.split(',');
    const results = {};
    
    // Mock comparison data
    driverIds.forEach(driverId => {
      const mockLapTimes = [];
      for (let lap = 1; lap <= 10; lap++) {
        mockLapTimes.push({
          lap_number: lap,
          driver_number: driverId,
          lap_time: 93000 + (Math.random() * 2000 - 1000)
        });
      }
      results[driverId] = mockLapTimes;
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error comparing drivers', error: error.message });
  }
});

// Get race calendar
router.get('/calendar', async (req, res) => {
  try {
    // For now, return mock data
    const mockCalendar = [
      {
        id: '1',
        name: 'Bahrain Grand Prix',
        circuit: 'Bahrain International Circuit',
        date: '2023-03-05T15:00:00Z',
        status: 'Completed'
      },
      {
        id: '2',
        name: 'Saudi Arabian Grand Prix',
        circuit: 'Jeddah Corniche Circuit',
        date: '2023-03-19T17:00:00Z',
        status: 'Completed'
      },
      {
        id: '3',
        name: 'Australian Grand Prix',
        circuit: 'Albert Park Circuit',
        date: '2023-04-02T05:00:00Z',
        status: 'Completed'
      },
      {
        id: '4',
        name: 'Miami Grand Prix',
        circuit: 'Miami International Autodrome',
        date: '2023-05-07T19:30:00Z',
        status: 'Upcoming'
      }
    ];
    res.json(mockCalendar);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching race calendar', error: error.message });
  }
});

// Get available sessions
router.get('/sessions', async (req, res) => {
  try {
    // For now, return mock data
    const mockSessions = [
      {
        id: '1',
        name: 'Bahrain Grand Prix - Race',
        circuit: 'Bahrain International Circuit',
        date: '2023-03-05T15:00:00Z',
        type: 'Race'
      },
      {
        id: '2',
        name: 'Saudi Arabian Grand Prix - Race',
        circuit: 'Jeddah Corniche Circuit',
        date: '2023-03-19T17:00:00Z',
        type: 'Race'
      },
      {
        id: '3',
        name: 'Australian Grand Prix - Race',
        circuit: 'Albert Park Circuit',
        date: '2023-04-02T05:00:00Z',
        type: 'Race'
      },
      {
        id: '4',
        name: 'Miami Grand Prix - Qualifying',
        circuit: 'Miami International Autodrome',
        date: '2023-05-06T19:00:00Z',
        type: 'Qualifying'
      },
      {
        id: '5',
        name: 'Miami Grand Prix - Race',
        circuit: 'Miami International Autodrome',
        date: '2023-05-07T19:30:00Z',
        type: 'Race'
      }
    ];
    res.json(mockSessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
});

// Compare drivers stats
router.get('/compare-stats', async (req, res) => {
  try {
    const { drivers, sessionId, statType } = req.query;
    
    if (!drivers || !sessionId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    const driverIds = drivers.split(',');
    const results = [];
    
    // Mock comparison data for different statistics
    const statTypes = {
      speed: 'Average Speed (km/h)',
      sector: 'Sector Times',
      pitstop: 'Pit Stop Time (s)'
    };
    
    // Generate random comparison data points for chart
    for (let i = 1; i <= 10; i++) {
      const dataPoint = { interval: i };
      
      driverIds.forEach(driverId => {
        // Generate different random values based on stat type
        if (statType === 'speed') {
          dataPoint[driverId] = 280 + (Math.random() * 30);
        } else if (statType === 'sector') {
          dataPoint[driverId] = 30 + (Math.random() * 5);
        } else {
          dataPoint[driverId] = 2 + (Math.random() * 1.5);
        }
      });
      
      results.push(dataPoint);
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error comparing driver stats', error: error.message });
  }
});

// Test API connection
router.get('/test', async (req, res) => {
  try {
    // Try to connect to the Open F1 API
    const response = await axios.get(`${BASE_URL}/sessions`);
    res.json({
      status: 'success',
      message: 'Successfully connected to Open F1 API',
      data: response.data.slice(0, 5) // Just return the first few items
    });
  } catch (error) {
    console.error('Error testing F1 API:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error testing F1 API', 
      error: error.message 
    });
  }
});

// Get all drivers
router.get('/drivers', async (req, res) => {
  try {
    // Return mock data for available drivers
    const mockDrivers = [
      { driverId: '1', fullName: 'Max Verstappen', code: 'VER', team: { name: 'Red Bull Racing', color: '#0600EF' } },
      { driverId: '11', fullName: 'Sergio Perez', code: 'PER', team: { name: 'Red Bull Racing', color: '#0600EF' } },
      { driverId: '16', fullName: 'Charles Leclerc', code: 'LEC', team: { name: 'Ferrari', color: '#DC0000' } },
      { driverId: '55', fullName: 'Carlos Sainz', code: 'SAI', team: { name: 'Ferrari', color: '#DC0000' } },
      { driverId: '44', fullName: 'Lewis Hamilton', code: 'HAM', team: { name: 'Mercedes', color: '#00D2BE' } },
      { driverId: '63', fullName: 'George Russell', code: 'RUS', team: { name: 'Mercedes', color: '#00D2BE' } },
      { driverId: '4', fullName: 'Lando Norris', code: 'NOR', team: { name: 'McLaren', color: '#FF8700' } },
      { driverId: '3', fullName: 'Daniel Ricciardo', code: 'RIC', team: { name: 'McLaren', color: '#FF8700' } },
      { driverId: '14', fullName: 'Fernando Alonso', code: 'ALO', team: { name: 'Aston Martin', color: '#006F62' } },
      { driverId: '18', fullName: 'Lance Stroll', code: 'STR', team: { name: 'Aston Martin', color: '#006F62' } }
    ];
    
    res.json(mockDrivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drivers', error: error.message });
  }
});

module.exports = router;