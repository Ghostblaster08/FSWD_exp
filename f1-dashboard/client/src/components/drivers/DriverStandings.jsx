import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Avatar, Chip
} from '@mui/material';
import axios from 'axios';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const DriverStandings = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDriverStandings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/drivers/standings`);
        setStandings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching driver standings');
        console.error('Error fetching driver standings:', err);
        setLoading(false);
      }
    };

    fetchDriverStandings();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Driver Standings
        <Chip 
          icon={<EmojiEventsIcon />} 
          label="2025 Season" 
          color="primary" 
          sx={{ ml: 2 }} 
        />
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="driver standings table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell align="center">Position</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Team</TableCell>
              <TableCell align="center">Points</TableCell>
              <TableCell align="center">Wins</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standings.map((driver, index) => (
              <TableRow 
                key={driver.driverId}
                sx={{ 
                  '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                  '&:hover': { backgroundColor: '#eaeaea' },
                  borderLeft: index === 0 ? `4px solid gold` : 'none'
                }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={driver.photoUrl}
                      alt={driver.fullName}
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        marginRight: 2, 
                        border: `2px solid ${driver.team?.color || '#ccc'}`
                      }}
                    />
                    <Link to={`/drivers/${driver.driverId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {driver.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {driver.code}
                        </Typography>
                      </Box>
                    </Link>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box 
                    component="span" 
                    sx={{ 
                      display: 'inline-block',
                      width: 12,
                      height: 12,
                      backgroundColor: driver.team?.color || '#ccc',
                      marginRight: 1,
                      borderRadius: '50%'
                    }} 
                  />
                  {driver.team?.name}
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body1" fontWeight="bold">
                    {driver.points}
                  </Typography>
                </TableCell>
                <TableCell align="center">{driver.wins}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DriverStandings;