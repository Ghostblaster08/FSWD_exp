import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Box, FormControl, InputLabel, MenuItem, Select, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import f1Service from '../../services/f1Service';

const FavoriteDrivers = ({ drivers = [], socket, onAddFavorite, onRemoveFavorite }) => {
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch available drivers on component mount
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const driversData = await f1Service.getAllDrivers();
        
        // Filter out drivers that are already in favorites
        const availableDriversFiltered = driversData.filter(
          driver => !drivers.some(favorite => favorite.driverId === driver.driverId)
        );
        
        setAvailableDrivers(availableDriversFiltered);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [drivers]);

  const handleDriverChange = (event) => {
    setSelectedDriver(event.target.value);
  };

  const handleAddFavorite = () => {
    if (!selectedDriver) return;
    
    const driverToAdd = availableDrivers.find(driver => driver.driverId === selectedDriver);
    if (driverToAdd && onAddFavorite) {
      onAddFavorite(driverToAdd);
      setSelectedDriver(''); // Reset selection after adding
    }
  };

  const handleRemoveFavorite = (driverId) => {
    if (onRemoveFavorite) {
      onRemoveFavorite(driverId);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Favorite Drivers</Typography>
      
      {/* Driver selection form */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="driver-select-label">Add driver</InputLabel>
          <Select
            labelId="driver-select-label"
            id="driver-select"
            value={selectedDriver}
            label="Add driver"
            onChange={handleDriverChange}
            disabled={loading || availableDrivers.length === 0}
          >
            {availableDrivers.map((driver) => (
              <MenuItem key={driver.driverId} value={driver.driverId}>
                {driver.fullName || driver.driverId}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddFavorite}
          disabled={!selectedDriver || loading}
        >
          Add
        </Button>
      </Box>
      
      {/* Favorites list */}
      <List>
        {drivers && drivers.length > 0 ? (
          drivers.map((driver, index) => (
            <ListItem key={index} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFavorite(driver.driverId)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={driver.fullName || driver.driverId || 'Unknown Driver'} />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No favorite drivers selected" />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default FavoriteDrivers;