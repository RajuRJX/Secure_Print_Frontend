import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Grid
} from '@mui/material';
import { 
  PhotoCamera, 
  Upload, 
  LocationOn, 
  Person, 
  Email, 
  Phone, 
  Description,
  Security,
  CloudUpload
} from '@mui/icons-material';
import axios from 'axios';

const QRUpload = () => {
  const { centerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [centerInfo, setCenterInfo] = useState(null);
  const [file, setFile] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!centerId) {
      setError('Invalid center ID');
      setLoading(false);
      return;
    }
    fetchCenterInfo();
  }, [centerId]);

  const fetchCenterInfo = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/cyber-center-qr/${centerId}`);
      setCenterInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch center info:', error);
      setError('Failed to load cyber center information. Please check if the center ID is correct.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size should be less than 10MB');
        return;
      }
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selectedFile.type)) {
        setError('Only PDF and DOCX files are allowed');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('name', name);
      formData.append('phone_number', phoneNumber);
      formData.append('email', email);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/documents/direct-upload/${centerId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccess('Document uploaded successfully! You will receive an OTP on your email and phone.');
      setFile(null);
      setName('');
      setPhoneNumber('');
      setEmail('');
      
      // Reset form
      e.target.reset();
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !centerInfo) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 4, sm: 6 } }}>
      <Stack spacing={{ xs: 2, sm: 4 }}>
        {/* Header Section */}
        <Box 
          sx={{ 
            p: { xs: 2, sm: 4 },
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
          {centerInfo && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {centerInfo.centerName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <LocationOn sx={{ mr: 0.5, fontSize: 20 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {centerInfo.centerAddress}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Features Section */}
        <Card sx={{ backgroundColor: '#e8efff' }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Security sx={{ fontSize: 40, color: '#1e40af', mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ color: '#1e40af', fontWeight: 500 }}>Secure Upload</Typography>
                  <Typography variant="body2" color="text.secondary">
                    End-to-end encryption
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Description sx={{ fontSize: 40, color: '#1e40af', mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ color: '#1e40af', fontWeight: 500 }}>Multiple Formats</Typography>
                  <Typography variant="body2" color="text.secondary">
                    PDF & DOCX support
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <CloudUpload sx={{ fontSize: 40, color: '#1e40af', mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ color: '#1e40af', fontWeight: 500 }}>Quick Process</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Instant OTP delivery
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Upload Form */}
        <Card sx={{ backgroundColor: '#e8efff' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {error && (
              <Alert severity="error" sx={{ mb: { xs: 2, sm: 3 } }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: { xs: 2, sm: 3 } }} onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#1e40af' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#1e40af',
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#1e40af' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#1e40af',
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                margin="normal"
                required
                type="tel"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: '#1e40af' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#1e40af',
                    },
                  },
                }}
              />

              <Box sx={{ mt: { xs: 2, sm: 3 }, mb: { xs: 1, sm: 2 } }}>
                <input
                  accept=".pdf,.docx"
                  style={{ display: 'none' }}
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-input">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<PhotoCamera />}
                    sx={{
                      height: 56,
                      borderColor: '#1e40af',
                      color: '#1e40af',
                      '&:hover': {
                        borderColor: '#1e3a8a',
                        backgroundColor: 'rgba(30, 64, 175, 0.04)',
                      },
                    }}
                  >
                    Select Document
                  </Button>
                </label>
                {file && (
                  <Box sx={{ 
                    mt: { xs: 1.5, sm: 2 }, 
                    p: { xs: 1.5, sm: 2 }, 
                    borderRadius: 1,
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Description sx={{ color: '#1e40af' }} />
                    <Typography variant="body2" sx={{ color: '#1e40af', fontWeight: 500 }}>
                      {file.name}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={uploading || !file}
                startIcon={<Upload />}
                sx={{ 
                  mt: { xs: 2, sm: 2 },
                  height: 56,
                  background: 'linear-gradient(to right, #1e40af, #6b21a8)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #1e3a8a, #581c87)',
                  },
                  '&.Mui-disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Instructions Section */}
        <Card sx={{ backgroundColor: '#e8efff' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1e40af', fontWeight: 600 }}>
              How it works
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                1. Fill in your details and select your document
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2. Upload your document securely
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3. Receive an OTP via email and SMS
              </Typography>
              <Typography variant="body2" color="text.secondary">
                4. Visit the cyber center with your OTP to print your document
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default QRUpload; 