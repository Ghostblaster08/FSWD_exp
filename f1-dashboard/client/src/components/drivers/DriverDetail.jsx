import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, Paper, Typography, Grid, Button, Avatar, 
  Chip, Divider, CircularProgress, Card, CardContent 
} from '@mui/material';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import axios from 'axios';

const DriverDetail = ({ socket }) => {
  const { driverId } = useParams();
  const [driver, setDriver] = useState(null);
  const [seasonResults, setSeasonResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [liveData, setLiveData] = useState(null);
  
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        // Fetch driver details
        const driverRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/drivers/${driverId}`);
        setDriver(driverRes.data);
        
        // Fetch driver's season results
        const resultsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/f1data/driver/${driverId}/results`);
        setSeasonResults(resultsRes.data);
        
        // Check if driver is in favorites
        const token = localStorage.getItem('f1Token');
        if (token) {
          const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setIsFavorite(userRes.data.favoriteDrivers.includes(driverId));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching driver data:', error);
        setLoading(false);
      }
    };
    
    fetchDriverData();
    
    // Subscribe to real-time updates for this driver
    if (socket) {
      socket.emit('followDriver', driverId);
      
      socket.on('driverUpdate', (data) => {
        setLiveData(data);
      });
    }
    
    return () => {
      // Unsubscribe when component unmounts
      if (socket) {
        socket.off('driverUpdate');
      }
    };
  }, [driverId, socket]);
  
  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem('f1Token');
      if (!token) {
        // Redirect to login or show login modal
        return;
      }
      
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/favorite`, 
        { driverId }, 
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!driver) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Driver not found</Typography>
      </Box>
    );
  }
  
  // Prepare data for finish position chart
  const positionData = seasonResults.map(result => ({
    race: result.raceName,
    position: result.position || 20, // Default to 20 if DNF
    dnf: !result.position
  }));
  
  // Prepare data for results breakdown pie chart
  const resultsSummary = {
    wins: seasonResults.filter(r => r.position === 1).length,
    podiums: seasonResults.filter(r => r.position > 0 && r.position <= 3).length - 
             seasonResults.filter(r => r.position === 1).length,
    points: seasonResults.filter(r => r.position > 3 && r.position <= 10).length,
    outOfPoints: seasonResults.filter(r => r.position > 10).length,
    dnf: seasonResults.filter(r => !r.position).length
  };
  
  const resultsPieData = [
    { name: 'Wins', value: resultsSummary.wins, color: '#E10600' },
    { name: 'Podiums', value: resultsSummary.podiums, color: '#FFC300' },
    { name: 'Points', value: resultsSummary.points, color: '#27A745' },
    { name: 'Out of Points', value: resultsSummary.outOfPoints, color: '#1E1E1E' },
    { name: 'DNF', value: resultsSummary.dnf, color: '#6C757D' }
  ];
  
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Driver Header */}
      <Paper sx={{ p: 3, mb: 3, position: 'relative' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={2}>
            <Avatar 
              src={driver.imageUrl} 
              alt={driver.fullName} 
              sx={{ width: 120, height: 120, border: `4px solid ${driver.team.color || '#e10600'}` }} 
            />
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="h3">{driver.fullName}</Typography>
            <Typography variant="h5" color="text.secondary">
              #{driver.number} · {driver.code} · {driver.team.name}
            </Typography>
            <Box sx={{ mt: 2 }}>
            <Chip icon={<WorkspacePremiumIcon />} label={`${driver.stats.podiums} Podiums`} sx={{ mr: 1, mb: 1 }} />

              <Chip 
                icon={<EmojiEventsIcon />} 
                label={`${driver.stats.wins} Wins`} 
                sx={{ mr: 1, mb: 1 }} 
              />
              {driver.stats.championships > 0 && (
                <Chip 
                  icon={<EmojiEventsIcon />} 
                  label={`${driver.stats.championships}x World Champion`} 
                  color="primary"
                  sx={{ mb: 1 }} 
                />
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2} sx={{ textAlign: 'right' }}>
            <Button
              variant={isFavorite ? "contained" : "outlined"}
              color={isFavorite ? "primary" : "secondary"}
              startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={toggleFavorite}
            >
              {isFavorite ? 'Favorited' : 'Add to Favorites'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Live Data (if available) */}
      {liveData && (
        <Paper sx={{ p: 3, mb: 3, backgroundColor: 'rgba(225, 6, 0, 0.05)' }}>
          <Typography variant="h5" gutterBottom>Live Session Data</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary">Position</Typography>
                  <Typography variant="h4">{liveData.position}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary">Last Lap</Typography>
                  <Typography variant="h4">{liveData.lastLapTime}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary">Gap to Leader</Typography>
                  <Typography variant="h4">{liveData.gap || '+0.000s'}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Season Performance */}
      <Typography variant="h4" gutterBottom>Season Performance</Typography>
      <Grid container spacing={3}>
        {/* Race Results Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Race Results</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={positionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="race" />
                <YAxis reversed domain={[1, 20]} />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="position" 
                  fill={driver.team.color || '#E10600'}
                  name="Finishing Position" 
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Results Breakdown */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Results Breakdown</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={resultsPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resultsPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DriverDetail;