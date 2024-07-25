import { useEffect } from 'react';
import { useConfigContext } from '../hooks/useConfigContext';
import Appbar from '../components/AppBar.js';
import ConfigSwitch from '../components/ConfigSwitch.js';

const Home = () => {
    const { dispatch } = useConfigContext();

    useEffect(() => {
        const fetchConfigs = async () => {
            const response = await fetch((process.env.REACT_APP_BACKEND_URL)+'/config/getAll');
            const json = await response.json();

            if (response.ok){
                dispatch({type: 'SET_CONFIGS', payload: json})
                dispatch({type: 'SET_SELECTED', payload: json.find(c => c.current === true)})
            }
        }

        console.log("Use effect was called");

        fetchConfigs();
        
    }, [dispatch]);

    console.log("Home component rendered");

    return (
        <div className="home">
            <div className="configs">
                <Appbar />
                <ConfigSwitch />
            </div>
        </div>
    )
}

export default Home;
