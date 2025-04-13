import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Switch, FormControlLabel, Grid } from '@mui/material';

const UserSettings = () => {
  const [settings, setSettings] = useState({
    email: '',
    darkMode: false,
    notifications: true
  });
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setSettings({
      ...settings,
      [name]: e.target.type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings logic will be implemented here
    console.log('Settings updated:', settings);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>User Settings</Typography>
      
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={settings.email}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={handleChange}
                    name="darkMode"
                    color="primary"
                  />
                }
                label="Dark Mode"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={handleChange}
                    name="notifications"
                    color="primary"
                  />
                }
                label="Enable Notifications"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Save Settings
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserSettings;