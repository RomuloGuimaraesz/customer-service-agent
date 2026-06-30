import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Redirecting } from '../components/Redirecting';
import { getHomeRouteForRole } from '../config/roleAccess';

/**
 * Root Redirect Component - Redirects based on authentication status
 * Handles root path (/) redirects intelligently
 * 
 * @returns {JSX.Element} Redirect to appropriate route based on auth status
 */
export const RootRedirect = () => {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return <Redirecting />;
  }

  if (isAuthenticated) {
    return <Navigate to={getHomeRouteForRole(role)} replace />;
  }

  return <Navigate to="/auth/login" replace />;
};

