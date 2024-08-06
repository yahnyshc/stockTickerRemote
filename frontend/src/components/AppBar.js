import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from "../hooks/useLogout";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Appbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { user } = useAuthContext();
  const { logout } = useLogout();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    logout();
    handleMenuClose();
  };

  return (
    <Box >
      <AppBar position="relative" sx={{ backgroundColor: '#171717', padding: '10px 0' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo192.png" alt="logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
            <Typography variant="h6" component="div" sx={{ fontSize: '1.5rem', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>Stock Ticker</Link>
            </Typography>
          </Box>
          <div style={{ position: 'absolute', right: "10px" }}>
            {user && (
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
                  <MenuItem onClick={handleClick} sx={{ '&:hover': { backgroundColor: '#444' } }}>
                    Log out
                  </MenuItem>
                </Menu>
              </>
            )}
            {!user && (
              <Link to="/login">
                <Button variant="contained" style={{ margin: '0 0 5px 0' }}>Login</Button>
              </Link>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
