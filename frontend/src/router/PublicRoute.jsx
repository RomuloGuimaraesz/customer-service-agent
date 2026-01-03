import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Redirecting } from '../components/Redirecting';

/**
 * Public Route Component - Redirects to dashboard if already authenticated
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if not authenticated
 * @returns {JSX.Element} Public route or redirect to dashboard
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Redirecting />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard/pedidos" replace />;
  }

  return children;
};

