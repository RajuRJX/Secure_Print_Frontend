import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Documents
            </Typography>
            <Typography variant="body1">
              {user?.is_cyber_center
                ? 'You can view and print documents from the Print Documents page.'
                : 'You can upload documents from the Upload Document page.'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Typography variant="body1">
              Email: {user?.email}
            </Typography>
            <Typography variant="body1">
              Role: {user?.is_cyber_center ? 'Cyber Center' : 'User'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 