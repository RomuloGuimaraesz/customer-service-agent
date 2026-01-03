import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicRoute } from '../router/PublicRoute';

/**
 * Auth Layout Component - Wraps authentication routes with public route protection
 */
export const AuthLayout = () => {
  return (
    <PublicRoute>
      <Outlet />
    </PublicRoute>
  );
};

