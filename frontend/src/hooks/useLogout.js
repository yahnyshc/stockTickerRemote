import { useAuthContext } from './useAuthContext'
import { useConfigContext } from './useConfigContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: configsDispatch } = useConfigContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        dispatch({type: 'LOGOUT'})
        configsDispatch({type: 'SET_CONFIGS', payload: null})
        configsDispatch({type: 'SET_SELECTED', payload: null})
    }

    return {logout}
}