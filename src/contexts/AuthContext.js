import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useReducer, useEffect } from 'react';
import { authAPI } from '../lib/api';
const AuthContext = createContext(undefined);
// Auth Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case 'AUTH_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case 'AUTH_SUCCESS':
            return {
                user: action.payload.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case 'AUTH_FAILURE':
            return {
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            return {
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload,
                error: null,
            };
        default:
            return state;
    }
};
// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    // Check for existing token on app load
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('verbaac_auth_token');
            if (token) {
                try {
                    dispatch({ type: 'AUTH_START' });
                    const response = await authAPI.getMe();
                    dispatch({
                        type: 'AUTH_SUCCESS',
                        payload: { user: response.data.data, token },
                    });
                }
                catch (error) {
                    console.error('Token validation failed:', error);
                    localStorage.removeItem('verbaac_auth_token');
                    dispatch({ type: 'AUTH_FAILURE', payload: 'Token invalid' });
                }
            }
        };
        initializeAuth();
    }, []);
    const login = async (email, password) => {
        try {
            dispatch({ type: 'AUTH_START' });
            const response = await authAPI.login({ email, password });
            const { user, token } = response.data.data;
            localStorage.setItem('verbaac_auth_token', token);
            dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
        }
        catch (error) {
            const axiosError = error;
            const errorMessage = axiosError.response?.data?.error?.message || 'Login failed';
            dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
            throw error;
        }
    };
    const register = async (data) => {
        try {
            dispatch({ type: 'AUTH_START' });
            const response = await authAPI.register(data);
            const { user, token } = response.data.data;
            localStorage.setItem('verbaac_auth_token', token);
            dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
        }
        catch (error) {
            const axiosError = error;
            const errorMessage = axiosError.response?.data?.error?.message || 'Registration failed';
            dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
            throw error;
        }
    };
    const logout = async () => {
        try {
            await authAPI.logout();
        }
        catch (error) {
            console.error('Logout API call failed:', error);
        }
        finally {
            localStorage.removeItem('verbaac_auth_token');
            dispatch({ type: 'LOGOUT' });
        }
    };
    const updateProfile = async (data) => {
        try {
            const response = await authAPI.updateProfile(data);
            dispatch({ type: 'UPDATE_USER', payload: response.data.data });
        }
        catch (error) {
            const axiosError = error;
            const errorMessage = axiosError.response?.data?.error?.message || 'Profile update failed';
            dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
            throw error;
        }
    };
    const value = {
        ...state,
        login,
        register,
        logout,
        updateProfile,
    };
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
};
export default AuthContext;
