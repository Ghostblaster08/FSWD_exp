const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const axios = require('axios');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide username, email, and password' 
      });
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    console.log(`Attempting to register user: ${username}, ${email}`);

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).json({ message: 'Email already in use' });
        } else {
          return res.status(400).json({ message: 'Username already taken' });
        }
      }
    } catch (dbError) {
      console.error('Database error checking for existing user:', dbError);
      return res.status(500).json({ 
        message: 'Database connection error', 
        error: 'Could not check for existing users'
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      favoriteDrivers: [],
      preferences: {
        darkMode: false,
        notifications: true
      }
    });

    // Hash password
    try {
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      return res.status(500).json({ 
        message: 'Error creating account', 
        error: 'Password processing failed'
      });
    }

    try {
      await newUser.save();
      console.log(`User registered successfully: ${username}`);
    } catch (saveError) {
      console.error('Error saving user to database:', saveError);
      return res.status(500).json({ 
        message: 'Error creating account', 
        error: saveError.message
      });
    }

    // Create JWT token
    const payload = {
      user: {
        id: newUser.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_jwt_secret_dev_only',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('Error generating token:', err);
          return res.status(500).json({ 
            message: 'Error generating authentication token',
            userId: newUser.id // Return ID so they can still login
          });
        }
        res.json({ 
          message: 'Registration successful',
          token,
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
          }
        });
      }
    );
  } catch (error) {
    console.error('Unexpected error in registration:', error);
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        
        // Return token along with basic user info
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      }
    );
  } catch (error) {
    console.error('Error in user login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user - Protected route
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add favorite driver - Protected route
router.post('/favorite-drivers', auth, async (req, res) => {
  try {
    const { driverId } = req.body;
    
    // Get user from the database
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if driver is already in favorites
    const existingDriver = user.favoriteDrivers.find(
      driver => driver.driverId === driverId
    );
    
    if (existingDriver) {
      return res.status(400).json({ message: 'Driver already in favorites' });
    }
    
    // Fetch driver details from the API
    const driverInfo = await getDriverInfo(driverId);
    
    // Add to favorites
    user.favoriteDrivers.push(driverInfo);
    
    // Save the updated user document
    await user.save();
    
    res.json({ 
      message: `Driver ${driverId} added to favorites`,
      favoriteDrivers: user.favoriteDrivers
    });
  } catch (error) {
    console.error('Error adding favorite driver:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove favorite driver - Protected route
router.delete('/favorite-drivers/:driverId', auth, async (req, res) => {
  try {
    const { driverId } = req.params;
    
    // Get user from the database
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if driver is in favorites
    const driverIndex = user.favoriteDrivers.findIndex(
      driver => driver.driverId === driverId
    );
    
    if (driverIndex === -1) {
      return res.status(404).json({ message: 'Driver not found in favorites' });
    }
    
    // Remove from favorites
    user.favoriteDrivers.splice(driverIndex, 1);
    
    // Save the updated user document
    await user.save();
    
    res.json({ 
      message: `Driver ${driverId} removed from favorites`,
      favoriteDrivers: user.favoriteDrivers
    });
  } catch (error) {
    console.error('Error removing favorite driver:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to get driver info by ID
async function getDriverInfo(driverId) {
  try {
    const result = await axios.get(`${process.env.API_URL || 'http://localhost:5000'}/api/drivers/standings`);
    const drivers = result.data;
    
    const driver = drivers.find(d => d.driverId === driverId);
    if (driver) {
      return {
        driverId: driver.driverId,
        fullName: driver.fullName,
        code: driver.code || driver.driverId,
        team: {
          name: driver.team?.name || 'Unknown Team',
          color: driver.team?.color || '#cccccc'
        }
      };
    }
    
    // If driver not found in the standings, try direct driver endpoint
    const driverResponse = await axios.get(`${process.env.API_URL || 'http://localhost:5000'}/api/drivers/${driverId}`);
    if (driverResponse.data) {
      const driverData = driverResponse.data;
      return {
        driverId: driverData.driverId,
        fullName: driverData.fullName || `Driver ${driverId}`,
        code: driverData.code || driverId,
        team: {
          name: driverData.team?.name || 'Unknown Team',
          color: driverData.team?.color || '#cccccc'
        }
      };
    }
  } catch (error) {
    console.log('Error fetching driver from API:', error.message);
  }
  
  // Fallback to basic info
  return { 
    driverId, 
    fullName: `Driver ${driverId}`,
    code: driverId,
    team: { name: 'Unknown Team', color: '#cccccc' }
  };
}

module.exports = router;