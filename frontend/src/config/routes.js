/**
 * Application route paths
 * Centralized route definitions for consistency across the application
 */
export const ROUTES = {
  // Root
  ROOT: '/',
  
  // Auth routes
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  
  // Dashboard routes
  DASHBOARD: {
    BASE: '/dashboard',
    PEDIDOS: '/dashboard/pedidos',
    AGENDAMENTOS: '/dashboard/agendamentos',
    WHATSAPP: '/dashboard/whatsapp',
  },
};

/**
 * Helper function to build dashboard route with tab ID
 * @param {string} tabId - The tab ID (e.g., 'pedidos', 'agendamentos', 'whatsapp')
 * @returns {string} The full dashboard route path
 */
export const getDashboardRoute = (tabId) => {
  return `${ROUTES.DASHBOARD.BASE}/${tabId}`;
};












