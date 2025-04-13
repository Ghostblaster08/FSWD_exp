import React from 'react';
import { Typography, Box } from '@mui/material';

const TrackMap = ({ session, liveData }) => {
  return (
    <Box>
      <Typography variant="body1">
        Track Map Component (Placeholder)
      </Typography>
      {session ? (
        <Typography variant="body2">
          Track: {session.circuit_name || 'Unknown Circuit'}
        </Typography>
      ) : (
        <Typography variant="body2">No session data available</Typography>
      )}
    </Box>
  );
};

export default TrackMap;