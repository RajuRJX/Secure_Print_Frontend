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
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const UploadDocument = () => {
  const { user, token } = useAuth();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cyberCenters, setCyberCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCenters, setLoadingCenters] = useState(true);

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
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Upload Document
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Cyber Center</InputLabel>
            <Select
              value={selectedCenter}
              label="Select Cyber Center"
              onChange={(e) => setSelectedCenter(e.target.value)}
              required
              disabled={loadingCenters}
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
                    {center.center_name} - {center.center_address}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
            disabled={loading}
          >
            Choose File
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          {file && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected file: {file.name}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!file || !selectedCenter || loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UploadDocument; 