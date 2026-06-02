import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data on startup
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await API.get('/auth/me');
      if (res.data && res.data.success) {
        setUser(res.data.data);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load user session:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Register action
  const registerUser = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name, email, password });
      if (res.data && res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Registration failed. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Login action
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Login failed. Invalid credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPasswordAction = async (email) => {
    try {
      const res = await API.post('/auth/forgotpassword', { email });
      return {
        success: true,
        message: res.data.message,
        resetToken: res.data.resetToken, // Returned for simulated local testing
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Request failed.',
      };
    }
  };

  // Reset password
  const resetPasswordAction = async (resetToken, password) => {
    try {
      const res = await API.put(`/auth/resetpassword/${resetToken}`, { password });
      if (res.data && res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to reset password.',
      };
    }
  };

  // Logout action
  const logoutUser = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register: registerUser,
        login: loginUser,
        logout: logoutUser,
        forgotPassword: forgotPasswordAction,
        resetPassword: resetPasswordAction,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
