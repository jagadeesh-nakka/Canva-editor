import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize axios headers and auth state
  const initializeAuth = useCallback((token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    initializeAuth(null);
    navigate('/login');
  }, [navigate, initializeAuth]);

  const loadUser = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/user');
      setUser(res.data);
    } catch (err) {
      console.error("Error loading user:", err);
      logout();  // Ensure proper cleanup if request fails
    } finally {
      setLoading(false);
    }
  }, [logout]); // ✅ Added `logout` as a dependency

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      initializeAuth(res.data.token);
      setUser(res.data.user);
      await loadUser();
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false };
    }
  };

  const register = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      initializeAuth(res.data.token);
      setUser(res.data.user);
      await loadUser();
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false };
    }
  };

  useEffect(() => {
    initializeAuth(token);
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token, loadUser, initializeAuth]); // ✅ Ensured all dependencies are included

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
