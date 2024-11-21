import { useEffect, createContext, useReducer } from 'react';

const initialState = {
    user: sessionStorage.getItem('user') !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null,
    role: sessionStorage.getItem('role') || null,
    token: sessionStorage.getItem('token') || null
};

export const authContext = createContext(initialState);

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            sessionStorage.setItem('token', action.payload.token);
            return {
                user: action.payload.user,
                role: action.payload.role,
                token: action.payload.token
            };

        case 'LOGOUT':
            console.log('Reducer: LOGOUT');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('role');
            sessionStorage.removeItem('token');
            return {
                user: null,
                role: null,
                token: null
            };

        case 'DELETE_ACCOUNT':
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('role');
            sessionStorage.removeItem('token');
            return {
                user: null,
                role: null,
                token: null
            };

        default:
            return state;
    }
};

// Komponent dostarczający kontekst uwierzytelnienia
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        if (state.user) {
            sessionStorage.setItem('user', JSON.stringify(state.user));
        } else {
            sessionStorage.removeItem('user');
        }

        if (state.role) {
            sessionStorage.setItem('role', state.role);
        } else {
            sessionStorage.removeItem('role');
        }

        if (state.token) {
            sessionStorage.setItem('token', state.token);
        } else {
            sessionStorage.removeItem('token');
        }
    }, [state.user, state.role, state.token]);

    return (
        <authContext.Provider value={{ user: state.user, role: state.role, token: state.token, dispatch }}>
            {children}
        </authContext.Provider>
    );
};
