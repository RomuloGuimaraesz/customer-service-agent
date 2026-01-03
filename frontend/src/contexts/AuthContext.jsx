import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CONFIG } from '../config/constants';
import { SignUp } from '../domain/useCases/SignUp.js';
import { Login } from '../domain/useCases/Login.js';
import { UserSupabaseRepository } from '../infrastructure/supabase/UserSupabaseRepository.js';
import { supabase } from '../infrastructure/supabase/config.js';

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

  // Initialize use cases with repository
  const userRepository = new UserSupabaseRepository(supabase);
  const signUpUseCase = new SignUp({ userRepository });
  const loginUseCase = new Login({ userRepository });

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
    // Authenticate with Supabase
    // Check if the username is an email (Supabase uses email for authentication)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    
    if (!isEmail) {
      return {
        success: false,
        error: 'Por favor, use seu email para fazer login',
      };
    }

    try {
      // Authenticate with Supabase
      const result = await loginUseCase.execute({
        email: username,
        password: password,
      });

      if (result.success && result.data) {
        // Supabase authentication successful
        const creds = { username: result.data.username || username, password };
        setCredentials(creds);
        setIsAuthenticated(true);
        sessionStorage.setItem(CONFIG.AUTH_STORAGE_KEY, JSON.stringify(creds));
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || 'Email ou senha inválidos',
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Erro ao fazer login',
      };
    }
  }, [loginUseCase]);

  const logout = useCallback(async () => {
    // Sign out from Supabase if there's an active session
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // Ignore errors during logout
    }
    
    setCredentials({ username: '', password: '' });
    setIsAuthenticated(false);
    sessionStorage.removeItem(CONFIG.AUTH_STORAGE_KEY);
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      // Execute SignUp use case
      const result = await signUpUseCase.execute(userData);

      if (!result.success) {
        return {
          success: false,
          error: result.error,
        };
      }

      // After signup, user must confirm email before being authenticated
      // Do NOT set isAuthenticated to true here - user needs to confirm email first
      // Then they can login which will set isAuthenticated properly
      return {
        success: true,
        data: result.data,
        warning: 'Por favor, verifique seu email para confirmar sua conta',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao criar conta',
      };
    }
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
    signup,
    getAuthHeader,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
