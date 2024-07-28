import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Paper, Button, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Visibility, VisibilityOff, ContentCopy } from '@mui/icons-material';

import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const Profile = () => {
    const { user } = useAuthContext();
    const [apiKey, setApiKey] = useState(null);
    const [showApiKey, setShowApiKey] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { logout } = useLogout();

    useEffect(() => {
        const fetchApiKey = async () => {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/user/apikey?userId=${user.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
            });
            const json = await response.json();

            if (response.ok) {
                setApiKey(json.apiKey);
            }
        }

        if (user) {
            fetchApiKey();
        }
    }, [user]);

    const handleRegenerateApiKey = async () => {
        if (!user || !user.id || !user.token) {
            console.error("User is not authenticated");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/regenerate/apikey?userId=${user.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
            });

            const json = await response.json();

            if (response.ok) {
                setApiKey(json.apiKey);
                setShowApiKey(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user || !user.id || !user.token) {
            console.error("User is not authenticated");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/delete?userId=${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
            });

            if (response.ok) {
                logout();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCopyApiKey = () => {
        navigator.clipboard.writeText(apiKey);
        alert("API key copied to clipboard");
    };

    const paperStyle = { padding: "30px", margin: "20px auto" };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} style={paperStyle}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Profile
                    </Typography>
                    <Box component="form" sx={{ mt: 1 }}>
                        {apiKey && (
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    label="API Key"
                                    value={showApiKey ? apiKey : '••••••••••••••••'}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton onClick={() => setShowApiKey(!showApiKey)}>
                                                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                                <IconButton onClick={handleCopyApiKey}>
                                                    <ContentCopy />
                                                </IconButton>
                                            </Box>
                                        )
                                    }}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Box>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                            onClick={handleRegenerateApiKey}
                        >
                            Regenerate API Key
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ mt: 3 }}
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            Delete Account
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>{"Delete Account"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteAccount} color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Profile;
