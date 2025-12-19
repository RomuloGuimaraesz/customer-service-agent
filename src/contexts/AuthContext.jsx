import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CONFIG } from '../config/constants';

/**
 * Authentication Context
 */
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(CONFIG.AUTH_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCredentials(parsed);
        setIsAuthenticated(true);
      } catch (e) {
        sessionStorage.removeItem(CONFIG.AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    // Test credentials by making a request to the API
    const basicAuth = btoa(`${username}:${password}`);
    
    try {
      const response = await fetch(CONFIG.API_ENDPOINTS.pedidos, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
        },
      });

      if (response.ok) {
        const creds = { username, password };
        setCredentials(creds);
        setIsAuthenticated(true);
        sessionStorage.setItem(CONFIG.AUTH_STORAGE_KEY, JSON.stringify(creds));
        return { success: true };
      } else if (response.status === 401) {
        return { success: false, error: 'Usuário ou senha inválidos' };
      } else {
        return { success: false, error: `Erro do servidor: ${response.status}` };
      }
    } catch (err) {
      // If network error, allow login for demo mode
      const creds = { username, password };
      setCredentials(creds);
      setIsAuthenticated(true);
      sessionStorage.setItem(CONFIG.AUTH_STORAGE_KEY, JSON.stringify(creds));
      return { success: true, warning: 'API indisponível - modo demonstração' };
    }
  }, []);

  const logout = useCallback(() => {
    setCredentials({ username: '', password: '' });
    setIsAuthenticated(false);
    sessionStorage.removeItem(CONFIG.AUTH_STORAGE_KEY);
  }, []);

  const getAuthHeader = useCallback(() => {
    if (credentials.username && credentials.password) {
      return `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
    }
    return null;
  }, [credentials]);

  const value = {
    isAuthenticated,
    isLoading,
    credentials,
    login,
    logout,
    getAuthHeader,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



