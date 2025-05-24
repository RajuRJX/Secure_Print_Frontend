import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  FormControlLabel,
  Checkbox,
  Paper
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    is_cyber_center: false,
    center_name: '',
    center_address: '',
    center_phone: ''
  });
  const [error, setError] = useState('');

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      console.log('Submitting registration:', formData);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.is_cyber_center ? formData.center_phone : formData.phone_number,
        is_cyber_center: formData.is_cyber_center,
        center_name: formData.center_name,
        center_address: formData.center_address
      });
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
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

            {formData.is_cyber_center ? (
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
                  multiline
                  rows={3}
                />

                <TextField
                  fullWidth
                  label="Center Phone Number"
                  name="center_phone"
                  value={formData.center_phone}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </>
            ) : (
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                margin="normal"
                required
              />
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
            >
              Register
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 