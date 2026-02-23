import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { getMe, logout as apiLogout } from '../services/authService';

const AuthContext = createContext(null);

const initialState = { user: null, loading: true };

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getMe()
      .then((res) => dispatch({ type: 'SET_USER', payload: res.data.user }))
      .catch(() => dispatch({ type: 'SET_USER', payload: null }))
      .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));
  }, []);

  const logout = useCallback(() => {
    apiLogout().catch(() => {});
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = {
    ...state,
    isAdmin: state.user?.role === 'admin',
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
