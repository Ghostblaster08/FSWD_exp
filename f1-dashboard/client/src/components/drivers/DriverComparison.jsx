import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Grid, FormControl, InputLabel, 
  Select, MenuItem, Button, CircularProgress
} from '@mui/material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';

// API base URL - adjust this to match your server URL
const API_BASE_URL = 'http://localhost:5000';

const DriverComparison = () => {
  const [drivers, setDrivers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statType, setStatType] = useState('lapTimes');
  const [error, setError] = useState('');
  
  // Predefined colors for consistent driver colors
  const driverColors = ['#00D2BE', '#DC0000', '#0600EF', '#FF8700', '#005AFF', '#FFFFFF'];
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch all drivers - using the correct endpoint
        const driversRes = await axios.get(`${API_BASE_URL}/api/drivers/standings`);
        setDrivers(driversRes.data);
        
        // Fetch recent sessions
        const sessionsRes = await axios.get(`${API_BASE_URL}/api/f1data/sessions`);
        setSessions(sessionsRes.data);
        setError('');
      } catch (error) {
        console.error('Error fetching comparison data:', error);
        setError('Failed to load initial data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  const handleDriverSelection = (event) => {
    setSelectedDrivers(event.target.value);
  };
  
  const handleSessionSelection = (event) => {
    setSelectedSession(event.target.value);
  };
  
  const handleStatTypeChange = (event) => {
    setStatType(event.target.value);
  };
  
  const fetchComparisonData = async () => {
    if (selectedDrivers.length === 0 || !selectedSession) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const endpoint = statType === 'lapTimes' 
        ? `${API_BASE_URL}/api/f1data/compare`
        : `${API_BASE_URL}/api/f1data/compare-stats`;
        
      const response = await axios.get(endpoint, {
        params: {
          drivers: selectedDrivers.join(','),
          sessionId: selectedSession,
          statType: statType
        }
      });
      
      if (!response.data || Object.keys(response.data).length === 0) {
        setError('No comparison data available for the selected drivers and session');
      } else {
        setComparisonData(response.data);
        setError('');
      }
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      setError('Failed to load comparison data. Please try again later.');
      setComparisonData(null);
    } finally {
      setLoading(false);
    }
  };
  
  const prepareChartData = () => {
    if (!comparisonData) return [];
    
    if (statType === 'lapTimes') {
      // Process lap time data
      const result = [];
      
      // Find the maximum lap count
      let maxLaps = 0;
      Object.values(comparisonData).forEach(driverData => {
        if (driverData.length > maxLaps) {
          maxLaps = driverData.length;
        }
      });
      
      // Create data points for each lap
      for (let lap = 1; lap <= maxLaps; lap++) {
        const lapData = { lap };
        
        Object.entries(comparisonData).forEach(([driverId, laps]) => {
          const driverLap = laps.find(l => l.lap_number === lap);
          if (driverLap) {
            const driver = drivers.find(d => d.driverId === driverId);
            lapData[driver ? driver.code : driverId] = driverLap.lap_time;
          }
        });
        
        result.push(lapData);
      }
      
      return result;
    } else {
      // Process other stat types
      return comparisonData;
    }
  };
  
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>Driver Comparison</Typography>
      
      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light' }}>
          <Typography color="error.contrastText">{error}</Typography>
        </Paper>
      )}
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Driver selection */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Drivers</InputLabel>
              <Select
                multiple
                value={selectedDrivers}
                onChange={handleDriverSelection}
                renderValue={(selected) => selected.map(id => {
                  const driver = drivers.find(d => d.driverId === id);
                  return driver ? driver.code : id;
                }).join(', ')}
              >
                {drivers.map((driver) => (
                  <MenuItem key={driver.driverId} value={driver.driverId}>
                    {driver.fullName} ({driver.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Session selection */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Session</InputLabel>
              <Select value={selectedSession} onChange={handleSessionSelection}>
                {sessions.map((session) => (
                  <MenuItem key={session.id} value={session.id}>
                    {session.name} ({new Date(session.date).toLocaleDateString()})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Stat type selection */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Stat Type</InputLabel>
              <Select value={statType} onChange={handleStatTypeChange}>
                <MenuItem value="lapTimes">Lap Times</MenuItem>
                <MenuItem value="speed">Speed</MenuItem>
                <MenuItem value="sector">Sector Times</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Compare button */}
          <Grid item xs={12} md={2}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={fetchComparisonData}
              disabled={selectedDrivers.length === 0 || !selectedSession || loading}
              sx={{ height: '56px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Compare'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}
      
      {comparisonData && !loading && (
        <Paper sx={{ p: 3, height: '500px' }}>
          <Typography variant="h6" gutterBottom>
            {statType === 'lapTimes' ? 'Lap Time Comparison' : 'Performance Comparison'}
          </Typography>
          
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={prepareChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lap" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedDrivers.map((driverId, index) => {
                const driver = drivers.find(d => d.driverId === driverId);
                return (
                  <Line
                    key={driverId}
                    type="monotone"
                    dataKey={driver ? driver.code : driverId}
                    stroke={driverColors[index % driverColors.length]}
                    activeDot={{ r: 8 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </Box>
  );
};

export default DriverComparison;