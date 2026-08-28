import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('pitchdeck_user') || localStorage.getItem('prepai_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('pitchdeck_token') || localStorage.getItem('prepai_token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch full user profile on initial mount if token exists
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('pitchdeck_user', JSON.stringify(res.user));
          }
        } catch (e) {
          console.warn('Failed to refresh user profile:', e.message);
        }
      }
      setLoading(false);
    }
    loadUser();

    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success) {
      localStorage.setItem('pitchdeck_token', res.token);
      localStorage.setItem('pitchdeck_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (name, email, password, profileData) => {
    const res = await api.post('/auth/register', { name, email, password, profileData });
    if (res.success) {
      localStorage.setItem('pitchdeck_token', res.token);
      localStorage.setItem('pitchdeck_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('pitchdeck_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    try {
      localStorage.removeItem('pitchdeck_token');
      localStorage.removeItem('pitchdeck_user');
      localStorage.removeItem('prepai_token');
      localStorage.removeItem('prepai_user');
      sessionStorage.clear();
    } catch (e) {
      console.warn('Storage clear error:', e);
    }
    setToken(null);
    setUser(null);
    window.dispatchEvent(new CustomEvent('auth:logout'));
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

