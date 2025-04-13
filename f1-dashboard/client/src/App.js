import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { io } from 'socket.io-client';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import DriverComparison from './components/drivers/DriverComparison';
import DriverDetail from './components/drivers/DriverDetail';
import UserSettings from './components/user/UserSettings';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [socket, setSocket] = useState(null);
  const [liveData, setLiveData] = useState(null);
  
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#E10600', // F1 red
      },
      secondary: {
        main: '#1E1E1E', // F1 dark
      }
    }
  });
  
  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });
    
    newSocket.on('liveTimingUpdate', (data) => {
      setLiveData(data);
    });
    
    setSocket(newSocket);
    
    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Routes>
            <Route path="/" element={<Dashboard liveData={liveData} socket={socket} />} />
            <Route path="/compare" element={<DriverComparison />} />
            <Route path="/driver/:driverId" element={<DriverDetail socket={socket} />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;