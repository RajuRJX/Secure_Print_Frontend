import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {

  Grid,
  Link,
  TextField,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Alert
} from '@mui/material';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    is_cyber_center: false,
    center_name: '',
    center_address: ''
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'is_cyber_center' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const { confirmPassword, ...registrationData } = formData;
      console.log('Submitting registration:', registrationData);
      
      const response = await register(registrationData);
      console.log('Registration successful:', response);
      
      // Show success message
      setError('Registration successful! Redirecting to login...');
      
      // Wait a moment before redirecting
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
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
            Sign Up
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Enter your  email below to sign up for an account.
          </Typography>

          {error && (
  <Alert
    severity={error.includes('successful') ? 'success' : 'error'}
    sx={{ width: '100%', mt: 2 }}
  >
    {error}
  </Alert>
)}

<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>

<TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  name="is_cyber_center"
                  checked={formData.is_cyber_center}
                  onChange={handleChange}
                />
              }
              label="Register as Cyber Center"
              sx={{ mt: 2 }}
            />

            {formData.is_cyber_center && (
              <>
                <TextField
                  fullWidth
                  label="Center Name"
                  name="center_name"
                  value={formData.center_name}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Center Address"
                  name="center_address"
                  value={formData.center_address}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </>
            )}
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
              <Link href="/login" underline="hover">
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
}

export default Register;