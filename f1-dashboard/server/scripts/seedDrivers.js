const mongoose = require('mongoose');
const axios = require('axios');
const Driver = require('../models/Driver');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/f1dashboard');

async function seedDrivers() {
  try {
    // Get current driver standings
    const response = await axios.get('https://ergast.com/api/f1/current/driverStandings.json');
    const driverData = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    
    for (const standing of driverData) {
      const driver = standing.Driver;
      const constructor = standing.Constructors[0];
      
      await Driver.findOneAndUpdate(
        { driverId: driver.driverId },
        {
          fullName: `${driver.givenName} ${driver.familyName}`,
          code: driver.code,
          nationality: driver.nationality,
          team: {
            name: constructor.name,
            color: getTeamColor(constructor.constructorId)
          },
          seasonStats: {
            points: parseInt(standing.points),
            wins: parseInt(standing.wins),
            position: parseInt(standing.position)
          },
          photoUrl: `https://www.formula1.com/content/dam/fom-website/drivers/${driver.givenName[0]}/${driver.driverId.toUpperCase()}01_${driver.givenName}_${driver.familyName}/driver-profile-image.png.transform/2col/image.png`
        },
        { upsert: true, new: true }
      );
    }
    
    console.log('Driver data has been seeded');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding driver data:', error);
    mongoose.disconnect();
  }
}

seedDrivers();