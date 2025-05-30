import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  Stack,
  Divider,
  useTheme,
  alpha,
  useMediaQuery,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SecurityIcon from '@mui/icons-material/Security';
import DescriptionIcon from '@mui/icons-material/Description';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const UploadDocument = () => {
  const { user, token } = useAuth();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cyberCenters, setCyberCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    console.log('UploadDocument mounted, token:', token);
    if (token) {
      fetchCyberCenters();
    }
  }, [token]);

  const fetchCyberCenters = async () => {
    try {
      setLoadingCenters(true);
      console.log('Fetching cyber centers with token:', token);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/cyber-centers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Cyber centers response:', response.data);
      if (Array.isArray(response.data)) {
        setCyberCenters(response.data);
      } else {
        console.error('Invalid cyber centers data:', response.data);
        setError('Invalid cyber centers data received');
      }
    } catch (error) {
      console.error('Error fetching centers:', error.response?.data || error.message);
      setError('Failed to fetch cyber centers: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingCenters(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!selectedCenter) {
      setError('Please select a cyber center');
      return;
    }

    if (!token) {
      setError('You must be logged in to upload documents');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);
    formData.append('cyber_center_id', selectedCenter);

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Document uploaded successfully');
      setFile(null);
      setSelectedCenter('');
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Alert severity="warning">
            Please log in to upload documents
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Stack spacing={4}>
        {/* Header Section */}
        <Box 
          sx={{ 
            p: 4,
            borderRadius: 2,
            background: 'linear-gradient(to right, #1e40af, #6b21a8)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Secure Document Upload
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Upload your documents securely and print them at your chosen cyber center
          </Typography>
        </Box>

        {/* Features Section */}
        <Card sx={{ backgroundColor: '#e8efff' }}>
          <CardContent>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <SecurityIcon sx={{ fontSize: 40, color: '#1e40af', mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ color: '#1e40af', fontWeight: 500 }}>Secure Upload</Typography>
                  <Typography variant="body2" color="text.secondary">
                    End-to-end encryption
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <DescriptionIcon sx={{ fontSize: 40, color: '#1e40af', mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ color: '#1e40af', fontWeight: 500 }}>Multiple Formats</Typography>
                  <Typography variant="body2" color="text.secondary">
                    PDF & DOCX support
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <LocationOnIcon sx={{ fontSize: 40, color: '#1e40af', mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ color: '#1e40af', fontWeight: 500 }}>Cyber Centers</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nationwide network
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Upload Form */}
        <Card sx={{ backgroundColor: '#e8efff' }}>
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Cyber Center</InputLabel>
                <Select
                  value={selectedCenter}
                  label="Select Cyber Center"
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  required
                  disabled={loadingCenters}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        '& .MuiMenuItem-root': {
                          whiteSpace: 'normal',
                          minHeight: '48px',
                          padding: '8px 16px',
                        }
                      }
                    }
                  }}
                >
                  {loadingCenters ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading centers...
                    </MenuItem>
                  ) : cyberCenters.length === 0 ? (
                    <MenuItem disabled>No cyber centers available</MenuItem>
                  ) : (
                    cyberCenters.map((center) => (
                      <MenuItem key={center.id} value={center.id}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {center.center_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {center.center_address}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ 
                  mb: 3,
                  background: 'linear-gradient(to right, #1e40af, #6b21a8)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #1e3a8a, #581c87)',
                  },
                  height: 56,
                }}
                startIcon={<CloudUploadIcon />}
                disabled={loading}
              >
                Choose File
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                />
              </Button>

              {file && (
                <Box sx={{ 
                  mb: 3, 
                  p: 2, 
                  borderRadius: 1,
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <DescriptionIcon sx={{ color: '#1e40af' }} />
                  <Typography variant="body2" sx={{ color: '#1e40af', fontWeight: 500 }}>
                    {file.name}
                  </Typography>
                </Box>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!file || !selectedCenter || loading}
                sx={{ 
                  background: 'linear-gradient(to right, #1e40af, #6b21a8)',
                  color: 'white !important',
                  '&:hover': {
                    background: 'linear-gradient(to right, #1e3a8a, #581c87)',
                  },
                  height: 56,
                  '& .MuiButton-label': {
                    color: 'white',
                  }
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    <span style={{ color: 'white' }}>Uploading...</span>
                  </>
                ) : (
                  <span style={{ color: 'white' }}>Upload Document</span>
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Instructions Section */}
        <Card sx={{ backgroundColor: '#e8efff' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1e40af', fontWeight: 600 }}>
              How it works
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                1. Select a cyber center from the dropdown menu
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2. Choose your document (PDF or DOCX format)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3. Upload your document securely
              </Typography>
              <Typography variant="body2" color="text.secondary">
                4. Receive an OTP via email and SMS
              </Typography>
              <Typography variant="body2" color="text.secondary">
                5. Visit the cyber center with your OTP to print your document
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default UploadDocument; 