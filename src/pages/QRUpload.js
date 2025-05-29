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
  IconButton
} from '@mui/material';
import { PhotoCamera, Upload } from '@mui/icons-material';
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
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Upload Document
        </Typography>
        
        {centerInfo && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {centerInfo.centerName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {centerInfo.centerAddress}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            type="email"
          />

          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            margin="normal"
            required
            type="tel"
          />

          <Box sx={{ mt: 2, mb: 2 }}>
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
              >
                Select Document
              </Button>
            </label>
            {file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {file.name}
              </Typography>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={uploading || !file}
            startIcon={<Upload />}
            sx={{ mt: 2 }}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        {uploading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default QRUpload; 