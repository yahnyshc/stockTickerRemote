import { createContext } from 'react';
import { useReducer } from 'react';

export const ConfigContext = createContext();

export const configsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CONFIGS':
            return {
                configs: action.payload,
                selected: state.selected
            }
        case 'CREATE_CONFIG':
            return {
                configs: [...state.configs, action.payload],
                selected: state.selected
            }
        case 'UPDATE_CONFIG':
            return {
                configs: [...state.configs.map((config) => config.id === action.payload.id ? action.payload : config)],
                selected: state.selected
            }
        case 'SET_SELECTED':
            return {
                configs: state.configs,
                selected: action.payload
            }
        case 'DELETE_CONFIG':
            return {
                configs: state.configs.filter((config) => config.id !== action.payload.id),
                selected: state.selected
            }
        default:
            return state
    }
}

export const ConfigContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(configsReducer, {
        configs: null,
        selected: null
    }); 

    return (
        <ConfigContext.Provider value={{...state, dispatch}}>
            { children }
        </ConfigContext.Provider>
    )
}
