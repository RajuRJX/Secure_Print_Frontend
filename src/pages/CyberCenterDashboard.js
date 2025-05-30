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
  Tooltip,
  Avatar
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import QRCode from 'react-qr-code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import PrintIcon from '@mui/icons-material/Print';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Cyber Center Dashboard
      </Typography>

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

      <Grid container spacing={4}>
        {/* QR Code Section */}
        <Grid item xs={12} md={showQRCode ? 4 : 12}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  {showQRCode ? 'Your QR Code' : 'Quick Actions'}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setShowQRCode(!showQRCode)}
                  sx={{
                    background: 'linear-gradient(to right, #1e40af, #6b21a8)',
                    '&:hover': {
                      background: 'linear-gradient(to right, #1e3a8a, #581c87)',
                    },
                  }}
                >
                  {showQRCode ? 'Hide QR' : 'Show QR'}
                </Button>
              </Box>
              <Collapse in={showQRCode}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  {qrCodeUrl && (
                    <>
                      <QRCode
                        value={qrCodeUrl}
                        size={200}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        viewBox={`0 0 200 200`}
                      />
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all', mb: 1 }}>
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
              </Collapse>
            </CardContent>
          </Card>
        </Grid>

        {/* Users List Section */}
        <Grid item xs={12} md={showQRCode ? 8 : 12}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BadgeIcon sx={{ mr: 1, color: '#1e40af' }} />
                <Typography variant="h6">
                  Users with Documents
                </Typography>
              </Box>
              <List sx={{ py: 0 }}>
                {Object.entries(documentsByUser).map(([userName, userDocs]) => (
                  <React.Fragment key={userName}>
                    <ListItemButton 
                      onClick={() => handleUserSelect(userName)}
                      selected={selectedUser === userName}
                      sx={{
                        borderRadius: 1,
                        mb: 1.5,
                        py: 1.5,
                        '&.Mui-selected': {
                          backgroundColor: '#e8efff',
                          '&:hover': {
                            backgroundColor: '#e8efff',
                          },
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(30, 64, 175, 0.08)',
                        },
                      }}
                    >
                      <Avatar sx={{ bgcolor: '#1e40af', mr: 2 }}>
                        <PersonIcon />
                      </Avatar>
                      <ListItemText 
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {userName}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <DescriptionIcon sx={{ fontSize: 16, mr: 0.5, color: '#6b7280' }} />
                            <Typography variant="body2" color="text.secondary">
                              {userDocs.length} document(s)
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>
                    <Divider sx={{ my: 1 }} />
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
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <DescriptionIcon sx={{ mr: 1, color: '#1e40af' }} />
                  <Typography variant="h6">
                    {selectedUser}'s Documents
                  </Typography>
                </Box>
                <List sx={{ py: 0 }}>
                  {documentsByUser[selectedUser].map((doc) => (
                    <ListItem 
                      key={doc.id}
                      sx={{
                        border: '1px solid #e5e7eb',
                        borderRadius: 2,
                        mb: 2,
                        p: 2,
                        backgroundColor: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#f8fafc',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <DescriptionIcon sx={{ mr: 1, color: '#1e40af' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {doc.file_name}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ pl: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <BadgeIcon sx={{ fontSize: 16, mr: 1, color: '#6b7280' }} />
                              <Typography component="span" variant="body2" color="text.primary">
                                Status: {doc.status}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AccessTimeIcon sx={{ fontSize: 16, mr: 1, color: '#6b7280' }} />
                              <Typography component="span" variant="body2" color="text.secondary">
                                Uploaded: {new Date(doc.created_at).toLocaleString()}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EmailIcon sx={{ fontSize: 16, mr: 1, color: '#6b7280' }} />
                              <Typography component="span" variant="body2" color="text.secondary">
                                Contact: {doc.uploaded_by_email}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      {doc.status === 'pending' && (
                        <Button
                          variant="contained"
                          onClick={() => handlePrint(doc)}
                          size="small"
                          startIcon={<PrintIcon />}
                          sx={{
                            background: 'linear-gradient(to right, #1e40af, #6b21a8)',
                            '&:hover': {
                              background: 'linear-gradient(to right, #1e3a8a, #581c87)',
                            },
                          }}
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
          sx: { 
            minWidth: '400px',
            p: 2,
            borderRadius: 2
          }
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
