import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Login from './Login';
import Signup from './Signup';

export default function Auth() {
    const [showSignup, setShowSignup] = useState(false);

    const handleSignupClick = () => {
        setShowSignup(true);
      };
    
      const handleLoginClick = () => {
        setShowSignup(false);
      };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" width="100%">
            {showSignup ? (
            <>
                <Signup />
                <Typography variant="body2" style={{ marginTop: '20px' }}>
                Already have an account?{' '}
                <Button color="primary" onClick={handleLoginClick}>
                    Log in
                </Button>
                </Typography>
            </>
            ) : (
            <>
                <Login />
                <Typography variant="body2" style={{ marginTop: '20px' }}>
                Don't have an account?{' '}
                <Button color="primary" onClick={handleSignupClick}>
                    Sign up
                </Button>
                </Typography>
            </>
            )}
        </Box>
    )

}