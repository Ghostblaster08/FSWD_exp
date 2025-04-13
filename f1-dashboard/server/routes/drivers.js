const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

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
    // Try to get actual data from database
    // const standings = await Driver.find().sort({ 'seasonStats.points': -1 });
    
    // For development, use mock data with rich details
    const mockStandings = [
      {
        driverId: '1',
        fullName: 'Max Verstappen',
        code: 'VER',
        points: 308,
        wins: 8,
        team: { name: 'Red Bull Racing', color: '#0600EF' },
        photoUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col/image.png'
      },
      {
        driverId: '16',
        fullName: 'Charles Leclerc',
        code: 'LEC',
        points: 257,
        wins: 3,
        team: { name: 'Ferrari', color: '#DC0000' },
        photoUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/2col/image.png'
      },
      {
        driverId: '11',
        fullName: 'Sergio Perez',
        code: 'PER',
        points: 201,
        wins: 2,
        team: { name: 'Red Bull Racing', color: '#0600EF' },
        photoUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/2col/image.png'
      },
      {
        driverId: '63',
        fullName: 'George Russell',
        code: 'RUS',
        points: 188,
        wins: 1,
        team: { name: 'Mercedes', color: '#00D2BE' },
        photoUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/2col/image.png'
      },
      {
        driverId: '55',
        fullName: 'Carlos Sainz',
        code: 'SAI',
        points: 175,
        wins: 1,
        team: { name: 'Ferrari', color: '#DC0000' },
        photoUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/2col/image.png'
      },
      {
        driverId: '44',
        fullName: 'Lewis Hamilton',
        code: 'HAM',
        points: 164,
        wins: 0,
        team: { name: 'Mercedes', color: '#00D2BE' },
        photoUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col/image.png'
      },
      {
        driverId: '4',
        fullName: 'Lando Norris',
        code: 'NOR',
        points: 115,
        wins: 0,
        team: { name: 'McLaren', color: '#FF8700' },
        photoUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/2col/image.png'
      },
      {
        driverId: '31',
        fullName: 'Esteban Ocon',
        code: 'OCO',
        points: 65,
        wins: 0,
        team: { name: 'Alpine', color: '#0090FF' },
        photoUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/2col/image.png'
      },
      {
        driverId: '14',
        fullName: 'Fernando Alonso',
        code: 'ALO',
        points: 54,
        wins: 0,
        team: { name: 'Aston Martin', color: '#006F62' },
        photoUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/2col/image.png'
      },
      {
        driverId: '77',
        fullName: 'Valtteri Bottas',
        code: 'BOT',
        points: 47,
        wins: 0,
        team: { name: 'Alfa Romeo', color: '#900000' },
        photoUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png.transform/2col/image.png'
      }
    ];
    
    res.json(mockStandings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching driver standings', error: error.message });
  }
});

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