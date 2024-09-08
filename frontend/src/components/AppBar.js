import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from "../hooks/useLogout";
import { useMediaQuery, useTheme } from '@mui/material';

export default function Appbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { user } = useAuthContext();
  const { logout } = useLogout();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // md is equivalent to 900px

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    logout();
    handleMenuClose();
  };

  return (
    <Box>
      <AppBar position="relative" sx={{ backgroundColor: '#171717', padding: '10px 0' }}>
        <Toolbar>
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo192.png" alt="logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
            <Typography variant="h6" component="div" sx={{ fontSize: '1.5rem', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>Stock Ticker</Link>
            </Typography>
          </Box>

          {/* User dropdown or login button */}
          <div style={{ position: 'absolute', right: "10px" }}>
            {user ? (
              <>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ 
                    cursor: 'pointer', 
                    marginRight: '1rem', 
                    fontSize: '1rem', 
                    display: 'flex', 
                    alignItems: 'center',
                    '&:hover': {
                      color: 'gray'
                    } 
                  }}
                  onClick={handleMenuClick}
                >
                  {user.username}
                  <ArrowDropDownIcon />
                </Typography>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{
                    '& .MuiPaper-root': {
                      backgroundColor: '#333',
                      color: 'white'
                    }
                  }}
                >
                  <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { backgroundColor: '#444' } }}>
                    <Link to="/profile" style={{ textDecoration: 'none', color: 'white' }}>Profile</Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogoutClick} sx={{ '&:hover': { backgroundColor: '#444' } }}>
                    Log out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              // Show "Login" button when the screen width is less than 900px
              isMobile && (
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/login"
                  sx={{
                      mt: 3,
                      mb: 2,
                      padding: '5px',
                      borderRadius: '8px',
                      background: 'linear-gradient(90deg, #007BFF 0%, #0056D2 100%)',
                      boxShadow: '0px 4px 12px rgba(0, 123, 255, 0.4)',
                      transition: 'background 0.3s ease',
                      '&:hover': {
                          background: 'linear-gradient(90deg, #0056D2 0%, #0041A8 100%)',
                      },
                  }}
                >
                  Login
                </Button>
              )
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
