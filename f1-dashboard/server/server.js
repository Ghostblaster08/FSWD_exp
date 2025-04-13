const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Routes
const driverRoutes = require('./routes/drivers');
const userRoutes = require('./routes/users');
const f1DataRoutes = require('./routes/f1data');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/f1dashboard')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/drivers', driverRoutes);
app.use('/api/users', userRoutes);
app.use('/api/f1data', f1DataRoutes);

// WebSocket for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join room for specific driver updates
  socket.on('followDriver', (driverId) => {
    socket.join(`driver-${driverId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Fetch and broadcast F1 data periodically
const fetchAndBroadcastF1Data = async () => {
  try {
    // Fetch live timing data from Open F1 API
    const response = await axios.get('https://api.openf1.org/v1/timing');
    const liveData = response.data;
    
    // Broadcast to all connected clients
    io.emit('liveTimingUpdate', liveData);
    
    // Process driver-specific data and emit to relevant rooms
    const driversData = {}; // Process data by driver
    
    Object.keys(driversData).forEach(driverId => {
      io.to(`driver-${driverId}`).emit('driverUpdate', driversData[driverId]);
    });
  } catch (error) {
    console.error('Error fetching F1 data:', error);
  }
};

// Update data every 5 seconds during active sessions
setInterval(fetchAndBroadcastF1Data, 5000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));