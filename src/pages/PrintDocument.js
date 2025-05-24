import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Print, Delete } from '@mui/icons-material';

const PrintDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [otp, setOtp] = useState('');
  const [printUrl, setPrintUrl] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/print/available`);
      setDocuments(response.data);
    } catch (err) {
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handlePrint = async (document) => {
    try {
      // Verify OTP
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/print/verify`, {
        document_id: document.id,
        otp: otp
      });

      // Open print service in a new window
      const printServiceUrl = `http://localhost:3001?document_id=${document.id}&otp=${otp}`;
      window.open(printServiceUrl, '_blank', 'width=600,height=400');
      
      // Close the OTP dialog
      setOpenDialog(false);
      setOtp('');
      
      // Refresh the document list
      fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/print/verify`, {
        document_id: selectedDocument.id,
        otp
      });
      setPrintUrl(response.data.signedUrl);
      setOpenDialog(false);
      fetchDocuments(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/print/${documentId}`);
      fetchDocuments(); // Refresh the list
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Available Documents for Printing
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {printUrl && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Document ready for printing!{' '}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => window.open(printUrl, '_blank')}
            sx={{ ml: 2 }}
          >
            Print Now
          </Button>
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.file_name}</TableCell>
                <TableCell>{doc.file_type}</TableCell>
                <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                <TableCell>{formatDate(doc.created_at)}</TableCell>
                <TableCell>
                  <Button
                    startIcon={<Print />}
                    onClick={() => handlePrint(doc)}
                    sx={{ mr: 1 }}
                  >
                    Print
                  </Button>
                  <Button
                    startIcon={<Delete />}
                    color="error"
                    onClick={() => handleDelete(doc.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="OTP"
            type="text"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleVerifyOTP} variant="contained">
            Verify & Print
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrintDocument; 