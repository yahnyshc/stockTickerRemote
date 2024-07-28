import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const login = async (username, password) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        let json;
        try {
            json = await response.json();
        } catch (err) {
            json = { error: 'Failed to parse response' };
        }

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }
        if (response.ok) {
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json));

            // update the auth context
            dispatch({ type: 'LOGIN', payload: json });

            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};