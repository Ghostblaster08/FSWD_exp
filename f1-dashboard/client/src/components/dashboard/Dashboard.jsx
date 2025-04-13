import React, { useState, useEffect, useContext } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

import DriverStandings from './DriverStandings';
import FavoriteDrivers from './FavoriteDrivers';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = ({ liveData, socket }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [driverStandings, setDriverStandings] = useState([]);
  const [favoriteDrivers, setFavoriteDrivers] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const { isAuthenticated, user } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Get active session info if any
        const sessionRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/f1data/active-session`);
        setActiveSession(sessionRes.data);
        
        // Get driver standings
        const standingsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/drivers/standings`);
        setDriverStandings(standingsRes.data);
        
        // Get user's favorite drivers (if logged in)
        if (isAuthenticated && user) {
          const token = localStorage.getItem('f1Token');
          const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setFavoriteDrivers(userRes.data.favoriteDrivers || []);
        } else {
          // Clear favorites if not logged in
          setFavoriteDrivers([]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
    
  }, [isAuthenticated, user]); // Re-fetch when auth state changes
  
  const handleAddFavoriteDriver = async (driver) => {
    try {
      if (!isAuthenticated) {
        setNotification({
          open: true,
          message: 'Please log in to add favorite drivers',
          severity: 'warning'
        });
        return;
      }
      
      const token = localStorage.getItem('f1Token');
      
      // Add to local state first for immediate UI update
      setFavoriteDrivers([...favoriteDrivers, driver]);
      
      // Update on the server
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/favorite-drivers`, 
        { driverId: driver.driverId },
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      
      setNotification({
        open: true,
        message: `Added ${driver.fullName || driver.driverId} to favorites`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error adding favorite driver:', error);
      // Revert the local state change if server update failed
      setFavoriteDrivers(favoriteDrivers.filter(d => d.driverId !== driver.driverId));
      setNotification({
        open: true,
        message: 'Failed to add driver to favorites',
        severity: 'error'
      });
    }
  };
  
  const handleRemoveFavoriteDriver = async (driverId) => {
    try {
      if (!isAuthenticated) {
        return;
      }
      
      const token = localStorage.getItem('f1Token');
      
      // Update local state immediately for responsive UI
      setFavoriteDrivers(favoriteDrivers.filter(driver => driver.driverId !== driverId));
      
      // Update on the server
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/users/favorite-drivers/${driverId}`,
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      
      setNotification({
        open: true,
        message: 'Driver removed from favorites',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error removing favorite driver:', error);
      setNotification({
        open: true,
        message: 'Failed to remove driver from favorites',
        severity: 'error'
      });
    }
  };
  
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Favorite Drivers */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '400px', overflow: 'auto' }}>
            <FavoriteDrivers 
              drivers={favoriteDrivers} 
              socket={socket} 
              onAddFavorite={handleAddFavoriteDriver} 
              onRemoveFavorite={handleRemoveFavoriteDriver}
            />
          </Paper>
        </Grid>
        
        {/* Driver Standings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '350px' }}>
            <Typography variant="h6" gutterBottom>Driver Standings</Typography>
            <DriverStandings standings={driverStandings} />
          </Paper>
        </Grid>
      </Grid>
      
      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;