import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { TextField, Button, Container, Box, CircularProgress, Alert } from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
    };

    return (
        <Container maxWidth="xs">
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    sx={{
                        mt: 3,
                        mb: 2,
                        padding: '10px',
                        borderRadius: '8px',
                        background: 'linear-gradient(90deg, #007BFF 0%, #0056D2 100%)',
                        boxShadow: '0px 4px 12px rgba(0, 123, 255, 0.4)',
                        transition: 'background 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #0056D2 0%, #0041A8 100%)',
                        },
                    }}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Log in'}
                </Button>
                {error && (
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default Login;
