import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from "../hooks/useLogout" 

export default function Appbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { user } = useAuthContext();
  const {logout} = useLogout()

  const handleMenuClick = (event) => {
    if (!user) {
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    logout()
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="relative" sx={{ backgroundColor: '#171717', padding: '10px 0' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}><Link to="/profile" style={{ textDecoration: 'none', color: 'black' }}>Profile</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Control</Link></MenuItem>
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: '1.5rem', marginLeft: '3%', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>Ticker Controller</Link>
          </Typography>
          <div style={{ marginRight: '0%' }}>
            <h4 style={{ margin: '0 0 5px 0px' }}>{user && `${user.username}`}</h4>
            <nav>
              {user && (
                <Button variant="contained" onClick={handleClick} style={{ margin: '0 0 5px 0', padding: '0px 10px' }}>Log out</Button>
              )}
              {!user && ( 
                <div>
                  <Link to="/login"><Button variant="contained" style={{ margin: '0 0 5px 0' }}>Login</Button></Link>
                </div>
              )}
            </nav>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}