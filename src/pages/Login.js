import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  useTheme
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left Side - Form */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: '#e8efff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 4
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
            Login
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Enter your registered email below to log in to your account.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: 'linear-gradient(to right, #3b82f6, #9333ea)',
                color: '#fff',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(to right, #2563eb, #7e22ce)',
                },
              }}
            >
              Sign In
            </Button>

            <Typography variant="body2" align="center">
              Forgot Password?{' '}
              <Link href="/forgot-password" underline="hover">
                Click Here
              </Link>
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              Don't have an account?{' '}
              <Link href="/register" underline="hover">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Right Side - Banner */}
      <Grid
        item
        xs={false}
        md={6}
        sx={{
          background: 'linear-gradient(to right, #000000, #1f2937)',
          color: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 4
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            <Box component="span" sx={{ color: '#3b82f6' }}>
              From Concept
            </Box>{' '}
            <Box component="span" sx={{ color: '#9333ea' }}>
              to Secure Print,
            </Box>
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 500 }}>
            We Make It Simple and Safe
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;