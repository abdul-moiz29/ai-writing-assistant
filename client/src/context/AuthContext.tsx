'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    console.log('%c[AuthContext] Token from localStorage:', 'color:blue;font-weight:bold', token);
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('%c[AuthContext] Set Authorization header:', 'color:green;font-weight:bold', api.defaults.headers.common['Authorization']);
      // Fetch user profile
      api.get('/api/users/me')
        .then(response => {
          console.log('%c[AuthContext] User profile loaded:', 'color:green;font-weight:bold', response.data);
          setUser(response.data);
        })
        .catch(error => {
          console.log('%c[AuthContext] Error fetching user profile:', 'color:red;font-weight:bold', error.response?.data || error.message);
          // If token is invalid, clear it
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log('%c[AuthContext] No token found in localStorage', 'color:orange;font-weight:bold');
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('%c🔑 Attempting login...', 'color: #FF9800; font-weight: bold', { email });
      const response = await api.post('/api/auth/login', { email, password });
      console.log('%c✅ Login successful:', 'color: #4CAF50; font-weight: bold', response.data);
      
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Store token in cookie for middleware (expires in 7 days)
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `token=${token}; path=/; expires=${expires};`;
      
      setUser(user);
    } catch (error: any) {
      console.log('%c❌ Login failed:', 'color: #f44336; font-weight: bold', error.response?.data || error.message);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      console.log('%c📝 Attempting signup...', 'color: #FF9800; font-weight: bold', { name, email });
      const response = await api.post('/api/auth/signup', { name, email, password });
      console.log('%c✅ Signup successful:', 'color: #4CAF50; font-weight: bold', response.data);
      
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Store token in cookie for middleware (expires in 7 days)
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `token=${token}; path=/; expires=${expires};`;
      
      setUser(user);
    } catch (error: any) {
      console.log('%c❌ Signup failed:', 'color: #f44336; font-weight: bold', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log('%c👋 Logging out user:', 'color: #9C27B0; font-weight: bold', user?.email);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    // Remove token cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    setUser(null);
    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 