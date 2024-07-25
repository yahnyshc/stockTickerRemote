import { ConfigContext } from '../context/ConfigContext';
import { useContext } from 'react';

export const useConfigContext = () => {
    const context = useContext(ConfigContext);

    if (!context) {
        throw Error('useConfigContext must be used inside ConfigContextProvider')
    }

    return context
}