import React from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Purple color for primary theme
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 'bold',
          boxShadow: '0 3px 5px 2px rgba(100, 100, 100, .3)',
          transition: 'transform 0.2s',
          '&:active': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
});

const NewConfigButton = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Tooltip title="Create New Config" arrow>
        <Button
          variant="contained"
          color="primary"
          sx={{
            position: 'absolute',
            color: '#fff',
            padding: '5px',
            right: '10px', // Position the button at the right
            top: '50%', // Vertically center the button
            transform: 'translateY(-50%)', // Adjust the position to be vertically centered
            borderRadius: '50%',
            minWidth: '0', // Remove default min-width
          }}
          {...props}
        >
          <AddIcon />
        </Button>
      </Tooltip>
    </ThemeProvider>
  );
};

export default NewConfigButton;
