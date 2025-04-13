import React from 'react';
import { Typography, List, ListItem, ListItemText, Box, Avatar, Divider, Chip, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components for better visual presentation
const StandingItem = styled(ListItem)(({ theme }) => ({
  borderLeft: '4px solid #ccc',
  marginBottom: '8px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const PositionChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  minWidth: '30px',
}));

const DriverStandings = ({ standings }) => {
  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>Driver Championship Standings</Typography>
      
      {standings && standings.length > 0 ? (
        <List disablePadding>
          {standings.map((driver, index) => (
            <React.Fragment key={index}>
              <StandingItem 
                style={{ borderLeftColor: driver.team?.color || '#ccc' }} 
                sx={{ py: 1 }}
                alignItems="center"
              >
                <PositionChip 
                  size="small" 
                  label={index + 1} 
                  sx={{ 
                    bgcolor: index === 0 ? 'gold' : 
                           index === 1 ? 'silver' : 
                           index === 2 ? '#CD7F32' : 'grey.300',
                    color: index < 3 ? 'black' : 'white',
                    mr: 2
                  }} 
                />
                
                <Avatar 
                  src={driver.photoUrl} 
                  alt={driver.fullName}
                  sx={{ 
                    bgcolor: driver.team?.color || '#ccc',
                    width: 36, 
                    height: 36,
                    mr: 2,
                    fontSize: '1rem'
                  }}
                >
                  {driver.code?.[0] || driver.fullName?.[0] || '?'}
                </Avatar>
                
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body1" fontWeight="bold">
                        {driver.fullName || 'Unknown Driver'}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {driver.points || 0}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {driver.team?.name || 'No Team'} 
                        {driver.code && <span> · {driver.code}</span>}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {driver.wins > 0 && `${driver.wins} ${driver.wins === 1 ? 'win' : 'wins'}`}
                      </Typography>
                    </Box>
                  }
                />
              </StandingItem>
              {index < standings.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="text.secondary">No standings data available</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default DriverStandings;