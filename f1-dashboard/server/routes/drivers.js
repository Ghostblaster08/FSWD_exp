const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const axios = require('axios'); // Add axios for API requests

// Get all drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drivers', error: error.message });
  }
});

// Get driver standings
router.get('/standings', async (req, res) => {
  try {
    // Get current season and round (or specific ones if provided in query params)
    const season = req.query.season || 'current';
    const round = req.query.round || 'last';
    
    try {
      // Fetch data from Ergast F1 API
      const response = await axios.get(
        `https://ergast.com/api/f1/${season}/${round}/driverStandings.json`
      );
      
      // Check if we have valid data
      if (response.data && 
          response.data.MRData && 
          response.data.MRData.StandingsTable && 
          response.data.MRData.StandingsTable.StandingsLists && 
          response.data.MRData.StandingsTable.StandingsLists.length > 0) {
          
        const standingsData = response.data.MRData.StandingsTable.StandingsLists[0];
        const driverStandings = standingsData.DriverStandings.map(standing => {
          const driver = standing.Driver;
          const constructor = standing.Constructors[0];
          
          return {
            driverId: driver.driverId,
            fullName: `${driver.givenName} ${driver.familyName}`,
            code: driver.code || driver.familyName.substring(0, 3).toUpperCase(),
            points: parseInt(standing.points),
            wins: parseInt(standing.wins),
            team: { 
              name: constructor.name, 
              color: getTeamColor(constructor.constructorId)
            },
            photoUrl: `https://www.formula1.com/content/dam/fom-website/drivers/${driver.givenName[0]}/${driver.driverId.toUpperCase()}01_${driver.givenName}_${driver.familyName}/driver-profile-image.png.transform/2col/image.png`
          };
        });
        
        return res.json(driverStandings);
      } else {
        throw new Error('Invalid response format from Ergast API');
      }
    } catch (apiError) {
      console.error('Error fetching data from Ergast API:', apiError.message);
      
      // Fall back to database as second option
      const dbStandings = await Driver.find().sort({ 'seasonStats.points': -1 });
      if (dbStandings && dbStandings.length > 0) {
        const formattedStandings = dbStandings.map(driver => ({
          driverId: driver.driverId,
          fullName: driver.fullName,
          code: driver.code,
          points: driver.seasonStats.points,
          wins: driver.seasonStats.wins,
          team: driver.team,
          photoUrl: driver.photoUrl
        }));
        
        return res.json(formattedStandings);
      }
      
      // If all else fails, throw the original error
      throw apiError;
    }
  } catch (error) {
    console.error('Error fetching driver standings:', error.message);
    res.status(500).json({ 
      message: 'Error fetching driver standings', 
      error: error.message 
    });
  }
});

// Helper function to map constructor IDs to team colors
function getTeamColor(constructorId) {
  const teamColors = {
    'red_bull': '#0600EF',
    'ferrari': '#DC0000',
    'mercedes': '#00D2BE',
    'mclaren': '#FF8700',
    'aston_martin': '#006F62',
    'alpine': '#0090FF',
    'alfa': '#900000',
    'haas': '#FFFFFF',
    'alphatauri': '#2B4562',
    'williams': '#005AFF'
  };
  
  return teamColors[constructorId] || '#333333'; // Default color
}

// Get a single driver by ID
router.get('/:driverId', async (req, res) => {
  try {
    const driver = await Driver.findOne({ driverId: req.params.driverId });
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching driver', error: error.message });
  }
});

module.exports = router;