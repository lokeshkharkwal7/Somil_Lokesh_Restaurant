import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginMerchant } from '../services/auth-service'; // ← fixed casing to match actual filename

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(window.atob(base64));
        setUser(decoded);
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      // BUG 1 FIX: API response shape is { success, message, data: { token, _id, ... } }
      // authService returns response.data from axios, so the full body is available here
      const response = await loginMerchant({ email, password });

      if (response.success && response.data?.token) {
        // BUG 2 FIX: destructure token out of response.data, not response
        const { token, ...userData } = response.data;

        localStorage.setItem('token', token);
        setToken(token);
        setUser(userData);

        // BUG 3 FIX: return user data so login.jsx can navigate with the _id
        return { success: true, user: userData };
      }

      return { success: false, error: response.message || 'Login failed' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Network error',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};