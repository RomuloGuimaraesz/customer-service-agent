import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CONFIG } from '../config/constants';
import { SignUp } from '../domain/useCases/SignUp.js';
import { Login } from '../domain/useCases/Login.js';
import { UserSupabaseRepository } from '../infrastructure/supabase/UserSupabaseRepository.js';
import { clearStoredAuthSession, supabase } from '../infrastructure/supabase/config.js';

/**
 * Authentication Context
 */
const AuthContext = createContext(null);

const emptyCredentials = { username: '' };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState(emptyCredentials);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // Initialize use cases with repository
  const userRepository = new UserSupabaseRepository(supabase);
  const signUpUseCase = new SignUp({ userRepository });
  const loginUseCase = new Login({ userRepository });

  const applySession = useCallback((session) => {
    if (!session?.access_token) {
      setAccessToken(null);
      setCredentials(emptyCredentials);
      setIsAuthenticated(false);
      setRole(null);
      setUserId(null);
      return;
    }

    const user = session.user;
    setAccessToken(session.access_token);
    setCredentials({
      username: user?.email || user?.user_metadata?.username || '',
    });
    setIsAuthenticated(true);
    setRole(user?.user_metadata?.role || null);
    setUserId(user?.id || null);
  }, []);

  // Restore the Supabase session for this tab. Drop any legacy password blob.
  useEffect(() => {
    sessionStorage.removeItem(CONFIG.AUTH_STORAGE_KEY);
    let active = true;

    supabase.auth.getSession()
      .then(({ data }) => {
        if (!active) return;
        applySession(data?.session ?? null);
      })
      .catch(() => {
        if (!active) return;
        applySession(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      applySession(session);
      setIsLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [applySession]);

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
      // Password is sent only to Supabase for this sign-in, then dropped.
      const result = await loginUseCase.execute({
        email: username,
        password: password,
      });

      if (result.success && result.data) {
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        if (session?.access_token) {
          applySession(session);
        } else {
          setAccessToken(null);
          setCredentials({ username: result.data.username || result.data.email || username });
          setIsAuthenticated(true);
          setRole(result.data.role || null);
          setUserId(result.data.id || null);
        }
        sessionStorage.removeItem(CONFIG.AUTH_STORAGE_KEY);

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
  }, [loginUseCase, applySession]);

  const logout = useCallback(async () => {
    // Sign out from Supabase if there's an active session
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // Ignore errors during logout
    }

    applySession(null);
    clearStoredAuthSession();
  }, [applySession]);

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
    if (!accessToken) return null;
    return `Bearer ${accessToken}`;
  }, [accessToken]);

  const value = {
    isAuthenticated,
    isLoading,
    credentials,
    role,
    userId,
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
