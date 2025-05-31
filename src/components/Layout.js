import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  AccountCircle, 
  Dashboard as DashboardIcon,
  Upload as UploadIcon,
  Print as PrintIcon,
  Menu as MenuIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = user ? [
    { text: 'Dashboard', icon: <DashboardIcon />, onClick: () => navigate('/') },
    ...(user.is_cyber_center 
      ? [{ text: 'Print Documents', icon: <PrintIcon />, onClick: () => navigate('/print') }]
      : [{ text: 'Upload Document', icon: <UploadIcon />, onClick: () => navigate('/upload') }]
    )
  ] : [];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Secure Print
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => {
              item.onClick();
              setMobileOpen(false);
            }}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          background: 'linear-gradient(to right, #1e40af, #6b21a8)',
          color: 'white',
          borderBottom: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ minHeight: { xs: '64px', sm: '70px' } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flexGrow: 1,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            <SecurityIcon 
              sx={{ 
                fontSize: { xs: 28, sm: 32 },
                mr: 1.5,
                color: 'white'
              }} 
            />
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: 'white',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                '& span': {
                  background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800
                }
              }}
            >
              Safe<span>Xribe</span>
            </Typography>
          </Box>
          {user && !isMobile && (
            <>
              {!user.is_cyber_center && (
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/upload')}
                  startIcon={<UploadIcon />}
                  sx={{ 
                    mr: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Upload Document
                </Button>
              )}
              {user.is_cyber_center && (
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/print')}
                  startIcon={<PrintIcon />}
                  sx={{ 
                    mr: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Print Documents
                </Button>
              )}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 2,
                  sx: {
                    mt: 1.5,
                    backgroundColor: '#e8efff',
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.08)',
                      },
                    },
                  },
                }}
              >
                <MenuItem onClick={() => {
                  handleClose();
                  navigate('/');
                }}>
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" sx={{ color: '#1e40af' }} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" sx={{ color: '#1e40af' }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Toolbar sx={{ minHeight: { xs: '64px', sm: '70px' } }} />

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            backgroundColor: '#e8efff',
            mt: '64px'
          },
        }}
      >
        {drawer}
      </Drawer>

      <Container 
        component="main" 
        sx={{ 
          mt: 4, 
          mb: 4, 
          flex: 1,
          px: { xs: 2, sm: 3 },
          maxWidth: { sm: 'lg', md: 'xl' },
        }}
      >
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#e8efff',
          borderTop: '1px solid',
          borderColor: 'rgba(30, 64, 175, 0.2)',
        }}
      >
        <Container maxWidth="sm">
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ fontWeight: 500 }}
          >
            © {new Date().getFullYear()} SafeXribe
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 