import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { usePedidos, PedidosProvider } from './PedidosContext';
import { useAgendamentos, AgendamentosProvider } from './AgendamentosContext';
import { useWhatsAppConversations, WhatsAppConversationsProvider } from './WhatsAppConversationsContext';
import { useTabAnalytics } from '../hooks/useTabAnalytics';
import { useSurfaceAnalytics } from '../hooks/useSurfaceAnalytics';
import { VALID_TAB_IDS, DEFAULT_TAB_ID } from '../config/dashboardTabs';
import { getDashboardRoute, ROUTES } from '../config/routes';

/**
 * Admin Data Context - Orchestrator Context
 *
 * This context now acts as an orchestrator that composes the focused contexts:
 * - PedidosContext
 * - AgendamentosContext
 * - WhatsAppConversationsContext
 *
 * It maintains the same public API for backward compatibility while delegating
 * specific functionality to the appropriate focused contexts.
 */
const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

/**
 * Parses the dashboard tab from the current pathname.
 * Returns null if the pathname is not under /dashboard.
 */
const parseDashboardTabFromPathname = (pathname) => {
  if (!pathname.startsWith(ROUTES.DASHBOARD.BASE)) {
    return null;
  }
  const pathTab = pathname.split('/').pop() || DEFAULT_TAB_ID;
  return VALID_TAB_IDS.includes(pathTab) ? pathTab : DEFAULT_TAB_ID;
};

/**
 * Derives the active surface from the current pathname.
 * Returns 'dashboard', 'contatos', or null for unknown routes.
 */
const deriveSurfaceFromPathname = (pathname) => {
  if (pathname.startsWith(ROUTES.DASHBOARD.BASE)) return 'dashboard';
  if (pathname.startsWith(ROUTES.CONTATOS.BASE)) return 'contatos';
  return null;
};

// Internal component that uses the focused contexts
const AdminContextInner = ({ children }) => {
  const { isAuthenticated, userId, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize activeTab based on current route
  const getInitialTab = () => {
    return parseDashboardTabFromPathname(location.pathname);
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Derive active surface from pathname
  const activeSurface = useMemo(
    () => deriveSurfaceFromPathname(location.pathname),
    [location.pathname]
  );

  // Use focused contexts
  const pedidosContext = usePedidos();
  const agendamentosContext = useAgendamentos();
  const whatsappContext = useWhatsAppConversations();

  // Destructure stable action functions to avoid depending on whole context objects
  const { refreshPedidos } = pedidosContext;
  const { refreshAgendamentos } = agendamentosContext;
  const { refreshConversations } = whatsappContext;

  // Sync activeTab with route changes (for redirects, direct navigation, etc.)
  useEffect(() => {
    const currentTab = parseDashboardTabFromPathname(location.pathname);
    
    // Update activeTab to match the route
    setActiveTab(prevTab => {
      return currentTab !== prevTab ? currentTab : prevTab;
    });
  }, [location.pathname]);

  // Use tab analytics hook (only tracks when activeTab is not null, i.e. on /dashboard)
  useTabAnalytics(activeTab, userId, role);

  // Use surface analytics hook (tracks app-level navigation)
  useSurfaceAnalytics(activeSurface, userId, role);

  // Navigate to a tab
  const navigateTab = useCallback((tabId) => {
    if (VALID_TAB_IDS.includes(tabId)) {
      setActiveTab(tabId);
      navigate(getDashboardRoute(tabId));
    }
  }, [navigate]);

  // Legacy fetchData function for backward compatibility
  const fetchData = useCallback(async (type) => {
    if (type === 'pedidos') {
      await pedidosContext.fetchPedidos();
    } else if (type === 'agendamentos') {
      await agendamentosContext.fetchAgendamentos();
    }
  }, [pedidosContext, agendamentosContext]);

  // Refresh all data (depends only on stable function refs, not entire context objects)
  const refreshAll = useCallback(() => {
    if (isAuthenticated) {
      refreshPedidos();
      refreshAgendamentos();
      refreshConversations();
    }
  }, [isAuthenticated, refreshPedidos, refreshAgendamentos, refreshConversations]);

  // Initial data fetch when authenticated (no automatic polling)
  useEffect(() => {
    if (isAuthenticated) {
      // Call the concrete refresh functions directly to avoid effect thrashing
      refreshPedidos();
      refreshAgendamentos();
      refreshConversations();
    }
    // Only depends on auth status; refresh function refs are stable and called inside
  }, [isAuthenticated]);

  // Compose the unified value object maintaining backward compatibility
  const value = {
    // Pedidos data
    pedidos: pedidosContext.pedidos,
    // Agendamentos data
    agendamentos: agendamentosContext.agendamentos,
    // WhatsApp conversations data
    conversations: whatsappContext.conversations,
    selectedConversation: whatsappContext.selectedConversation,

    // Loading states (composed from all contexts)
    loading: {
      pedidos: pedidosContext.loading,
      agendamentos: agendamentosContext.loading,
      conversations: whatsappContext.loading.conversations,
      messages: whatsappContext.loading.messages,
      sendMessage: whatsappContext.loading.sendMessage,
    },

    // Error states (composed from all contexts)
    error: {
      pedidos: pedidosContext.error,
      agendamentos: agendamentosContext.error,
      conversations: whatsappContext.error.conversations,
      messages: whatsappContext.error.messages,
      sendMessage: whatsappContext.error.sendMessage,
    },

    // Last updated (composed from all contexts)
    lastUpdated: {
      pedidos: pedidosContext.lastUpdated,
      agendamentos: agendamentosContext.lastUpdated,
      conversations: whatsappContext.lastUpdated.conversations,
    },

    // Active tab state
    activeTab,
    setActiveTab,
    navigateTab,

    // Legacy functions for backward compatibility
    fetchData,
    refreshAll,

    // WhatsApp functions
    fetchConversations: whatsappContext.fetchConversations,
    selectConversation: whatsappContext.selectConversation,
    fetchMessages: whatsappContext.fetchMessages,
    sendMessage: whatsappContext.sendMessage,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const AdminProvider = ({ children }) => {
  return (
    <PedidosProvider>
      <AgendamentosProvider>
        <WhatsAppConversationsProvider>
          <AdminContextInner>
            {children}
          </AdminContextInner>
        </WhatsAppConversationsProvider>
      </AgendamentosProvider>
    </PedidosProvider>
  );
};
