import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Container, Paper, Typography, TextField, 
  Button, Alert, CircularProgress 
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Get login token
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, formData);
      
      // Get user data including username and favorite drivers
      const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
        headers: { 'Authorization': `Bearer ${response.data.token}` }
      });
      
      // Create user object with the email from the form and username from the response
      const userData = {
        ...userRes.data,
        email: formData.email // Include the email from the login form
      };
      
      // Use AuthContext login function to store user data
      await login(response.data.token, userData);
      
      // Show success message
      console.log('Login successful!', userData);
      
      // Redirect to dashboard
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, borderRadius: '12px', boxShadow: 3 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Log In
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ 
                mt: 2, 
                mb: 3,
                py: 1.5,
                borderRadius: '8px',
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Log In'}
            </Button>
            
            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <Button color="primary" onClick={() => navigate('/register')}>
                Register
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;