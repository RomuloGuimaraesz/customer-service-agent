import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

/**
 * Root Layout Component - Provides authentication context to all routes
 */
export const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

