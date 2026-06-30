import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Redirecting } from '../components/Redirecting';

/**
 * Role Route Component - Redirects when the user's role is not allowed
 *
 * @param {Object} props
 * @param {(role: string|null) => boolean} props.allowedWhen
 * @param {(role: string|null) => string} props.redirectTo
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export const RoleRoute = ({ allowedWhen, redirectTo, children }) => {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return <Redirecting />;
  }

  if (!allowedWhen(role)) {
    return <Navigate to={redirectTo(role)} replace />;
  }

  return children;
};
