import React, { useContext, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Switch, 
  Box,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
  useTheme
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import CompareIcon from '@mui/icons-material/Compare';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AuthContext } from '../../context/AuthContext';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  // Use initials for avatar if username exists
  const getInitials = () => {
    if (!user || !user.username) return '?';
    
    const nameParts = user.username.split(' ');
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    
    return `${nameParts[0][0]}${nameParts[nameParts.length-1][0]}`.toUpperCase();
  };

  return (
    <AppBar position="static" elevation={3} sx={{ mb: 2 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo and brand */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="menu"
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h5" 
            component={Link} 
            to="/"
            sx={{ 
              fontWeight: 'bold',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            🏎️ F1 Dashboard
          </Typography>
        </Box>

        {/* Navigation links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/" 
            startIcon={<DashboardIcon />}
            sx={{ 
              borderRadius: '8px', 
              textTransform: 'none',
              fontWeight: 500,
              mx: 0.5
            }}
          >
            Dashboard
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/compare" 
            startIcon={<CompareIcon />}
            sx={{ 
              borderRadius: '8px', 
              textTransform: 'none',
              fontWeight: 500,
              mx: 0.5
            }}
          >
            Compare Drivers
          </Button>
          
          <Box mx={1} sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Switch 
              checked={darkMode} 
              onChange={toggleDarkMode} 
              color="default" 
              size="small" 
            />
          </Box>
          
          {/* Auth section - Login button or user menu */}
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <Tooltip title="Account settings">
                <Chip
                  avatar={
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.secondary.dark,
                        color: '#fff',
                        fontWeight: 'bold'
                      }}
                    >
                      {getInitials()}
                    </Avatar>
                  }
                  label={user && user.username ? user.username : 'User'}
                  onClick={handleMenu}
                  sx={{ 
                    borderRadius: '24px',
                    py: 0.5,
                    pl: 0.5,
                    pr: 1.5,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                />
              </Tooltip>
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
                open={open}
                onClose={handleClose}
              >
                <MenuItem 
                  component={Link} 
                  to="/settings" 
                  onClick={handleClose}
                  sx={{ gap: 1 }}
                >
                  <SettingsIcon fontSize="small" />
                  Settings
                </MenuItem>
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ gap: 1 }}
                >
                  <LogoutIcon fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              variant="outlined"
              startIcon={<AccountCircleIcon />}
              sx={{ 
                borderRadius: '8px',
                ml: 1,
                px: 2,
                borderColor: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;