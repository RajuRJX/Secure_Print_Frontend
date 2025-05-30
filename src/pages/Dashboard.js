import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Avatar,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Description as DocumentIcon,
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      {/* Welcome Section */}
      <Box 
        sx={{ 
          mb: 4,
          p: 4,
          borderRadius: 2,
          background: 'linear-gradient(to right, #1e40af, #6b21a8)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          {getWelcomeMessage()}, {user?.name}!
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Welcome to your Secure Document Printing Dashboard
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              transition: 'transform 0.2s',
              backgroundColor: '#e8efff',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    mr: 2
                  }}
                >
                  <DocumentIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  Document Management
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                {user?.is_cyber_center
                  ? 'Access and manage documents waiting to be printed at your cyber center.'
                  : 'Upload and manage your documents securely for printing.'}
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowIcon />}
                onClick={() => navigate(user?.is_cyber_center ? '/print' : '/upload')}
                sx={{ 
                  mt: 2,
                  background: 'linear-gradient(to right, #3b82f6, #9333ea)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #2563eb, #7e22ce)',
                  },
                }}
              >
                {user?.is_cyber_center ? 'View Documents' : 'Upload Document'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              transition: 'transform 0.2s',
              backgroundColor: '#e8efff',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'rgba(147, 51, 234, 0.1)',
                    color: '#9333ea',
                    mr: 2
                  }}
                >
                  <SecurityIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  Security Status
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                Your documents are protected with end-to-end encryption and secure printing protocols.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="#3b82f6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon sx={{ fontSize: 16, mr: 1 }} />
                  Security Status: Active
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Account Information */}
      <Card 
        sx={{ 
          mb: 4,
          backgroundColor: '#e8efff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                mr: 2,
                width: 48,
                height: 48
              }}
            >
              <AccountIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                Account Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your secure printing account details
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2,
                  backgroundColor: 'white',
                  borderColor: 'rgba(59, 130, 246, 0.2)',
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Email Address
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#1f2937' }}>
                  {user?.email}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2,
                  backgroundColor: 'white',
                  borderColor: 'rgba(59, 130, 246, 0.2)',
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Account Type
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#1f2937' }}>
                  {user?.is_cyber_center ? 'Cyber Center' : 'Standard User'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard; 