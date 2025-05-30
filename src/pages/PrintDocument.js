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
  DialogActions,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Print as PrintIcon, 
  Delete as DeleteIcon,
  Description as DocumentIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const PrintDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [otp, setOtp] = useState('');
  const [printUrl, setPrintUrl] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();

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
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      {/* Header Section */}
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
          Available Documents for Printing
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Manage and print documents securely with OTP verification
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: 'error.main'
            }
          }}
        >
          {error}
        </Alert>
      )}

      {printUrl && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: 'success.main'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              Document ready for printing!
            </Box>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={() => window.open(printUrl, '_blank')}
              sx={{
                background: 'linear-gradient(to right, #1e40af, #6b21a8)',
                '&:hover': {
                  background: 'linear-gradient(to right, #1e3a8a, #581c87)',
                },
              }}
            >
              Print Now
            </Button>
          </Box>
        </Alert>
      )}

      <Card 
        sx={{ 
          mb: 4,
          backgroundColor: '#e8efff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>File Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>Size</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>Uploaded</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow 
                    key={doc.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.08)',
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DocumentIcon sx={{ mr: 1, color: '#1e40af' }} />
                        {doc.file_name}
                      </Box>
                    </TableCell>
                    <TableCell>{doc.file_type}</TableCell>
                    <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                    <TableCell>{formatDate(doc.created_at)}</TableCell>
                    <TableCell>
                      <Tooltip title="Print Document">
                        <IconButton
                          onClick={() => handlePrint(doc)}
                          sx={{ 
                            color: '#1e40af',
                            '&:hover': {
                              backgroundColor: 'rgba(30, 64, 175, 0.1)',
                            },
                          }}
                        >
                          <PrintIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Document">
                        <IconButton
                          onClick={() => handleDelete(doc.id)}
                          sx={{ 
                            color: '#dc2626',
                            '&:hover': {
                              backgroundColor: 'rgba(220, 38, 38, 0.1)',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: '#e8efff',
          }
        }}
      >
        <DialogTitle sx={{ color: '#1f2937', fontWeight: 600 }}>
          Enter OTP for Verification
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="OTP"
            type="text"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '&:hover fieldset': {
                  borderColor: '#1e40af',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ 
              color: '#1f2937',
              '&:hover': {
                backgroundColor: 'rgba(30, 64, 175, 0.08)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleVerifyOTP} 
            variant="contained"
            sx={{
              background: 'linear-gradient(to right, #1e40af, #6b21a8)',
              '&:hover': {
                background: 'linear-gradient(to right, #1e3a8a, #581c87)',
              },
            }}
          >
            Verify & Print
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrintDocument; 