import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Collapse,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import QRCode from 'react-qr-code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CyberCenterDashboard = () => {
  const { token, user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (token) {
      fetchDocuments();
      fetchQRCode();
    }
  }, [token, user?.id]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/documents/center-documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(response.data);
    } catch (error) {
      setError('Failed to fetch documents: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchQRCode = async () => {
    if (!user?.id) return;
    
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/cyber-center-qr/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setQrCodeUrl(response.data.qrCodeUrl);
    } catch (error) {
      console.error('Failed to fetch QR code:', error);
    }
  };

  const copyQRCodeUrl = () => {
    navigator.clipboard.writeText(qrCodeUrl);
    setSuccess('QR code URL copied to clipboard');
  };

  // Group documents by user
  const documentsByUser = documents.reduce((acc, doc) => {
    const userName = doc.uploaded_by_name || 'Anonymous User';
    if (!acc[userName]) {
      acc[userName] = [];
    }
    acc[userName].push(doc);
    return acc;
  }, {});

  const handleUserSelect = (userName) => {
    setSelectedUser(userName);
  };

  const handlePrint = (document) => {
    setSelectedDocument(document);
    setOtp('');
    setError('');
    setSuccess('');
    setShowOtpDialog(true);
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    try {
      setError('');
      setSuccess('');

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/print/verify`,
        {
          document_id: selectedDocument.id,
          otp: otp
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.printServiceUrl) {
        setSuccess('OTP verified successfully');
        setShowOtpDialog(false);
        setSelectedDocument(null);
        setOtp('');
        fetchDocuments();

        // Open the document in a new tab
        window.open(response.data.printServiceUrl, '_blank');
      } else {
        setError('No signed URL received');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Failed to verify OTP: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCloseOtpDialog = () => {
    setShowOtpDialog(false);
    setSelectedDocument(null);
    setOtp('');
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cyber Center Dashboard
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

      <Grid container spacing={3}>
        {/* QR Code Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your QR Code
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                {qrCodeUrl && (
                  <>
                    <QRCode
                      value={qrCodeUrl}
                      size={200}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      viewBox={`0 0 200 200`}
                    />
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                        {qrCodeUrl}
                      </Typography>
                      <Tooltip title="Copy URL">
                        <IconButton onClick={copyQRCodeUrl} size="small">
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Users List Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Users with Documents
              </Typography>
              <List>
                {Object.entries(documentsByUser).map(([userName, userDocs]) => (
                  <React.Fragment key={userName}>
                    <ListItemButton 
                      onClick={() => handleUserSelect(userName)}
                      selected={selectedUser === userName}
                    >
                      <ListItemText 
                        primary={userName}
                        secondary={`${userDocs.length} document(s)`}
                      />
                    </ListItemButton>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Documents Section */}
        {selectedUser && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedUser}'s Documents
                </Typography>
                <List>
                  {documentsByUser[selectedUser].map((doc) => (
                    <ListItem 
                      key={doc.id}
                      sx={{
                        border: '1px solid #eee',
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    >
                      <ListItemText
                        primary={doc.file_name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              Status: {doc.status}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="text.secondary">
                              Uploaded: {new Date(doc.created_at).toLocaleString()}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="text.secondary">
                              Contact: {doc.uploaded_by_email}
                            </Typography>
                          </>
                        }
                      />
                      {doc.status === 'pending' && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handlePrint(doc)}
                          size="small"
                        >
                          Print
                        </Button>
                      )}
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* OTP Dialog */}
      <Dialog 
        open={showOtpDialog} 
        onClose={handleCloseOtpDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { minWidth: '400px', padding: '20px' }
        }}
      >
        <DialogTitle>
          Enter OTP for {selectedDocument?.file_name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, mb: 2 }}>
            <TextField
              autoFocus
              fullWidth
              label="Enter OTP"
              variant="outlined"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={!!error}
              helperText={error || 'Enter the OTP provided by the user'}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseOtpDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleVerifyOtp}
            variant="contained" 
            color="primary"
          >
            Verify & Print
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CyberCenterDashboard;
