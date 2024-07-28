import { useEffect } from 'react';
import { useConfigContext } from '../hooks/useConfigContext';
import { useAuthContext } from '../hooks/useAuthContext';
import ConfigSwitch from '../components/ConfigSwitch.js';

const Home = () => {
    const { dispatch } = useConfigContext();
    const {user} = useAuthContext()

    useEffect(() => {
        const fetchConfigs = async () => {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/config/getAll?userId=${user.id}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${user.token}`
                },
            });
            const json = await response.json();

            if (response.ok){
                dispatch({type: 'SET_CONFIGS', payload: json})
                dispatch({type: 'SET_SELECTED', payload: json.find(c => c.current === true)})
            }
        }

        console.log("Use effect was called");

        if (user){
            fetchConfigs();
        }
        
    }, [dispatch, user]);

    console.log("Home component rendered");

    return (
        <div className="home">
            <div className="configs">
                <ConfigSwitch />
            </div>
        </div>
    )
}

export default Home;
