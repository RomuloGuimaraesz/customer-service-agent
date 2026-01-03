import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { usePedidos, PedidosProvider } from './PedidosContext';
import { useAgendamentos, AgendamentosProvider } from './AgendamentosContext';
import { useWhatsAppConversations, WhatsAppConversationsProvider } from './WhatsAppConversationsContext';
import { useTabAnalytics } from '../hooks/useTabAnalytics';

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

// Internal component that uses the focused contexts
const AdminContextInner = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('pedidos');

  // Use focused contexts
  const pedidosContext = usePedidos();
  const agendamentosContext = useAgendamentos();
  const whatsappContext = useWhatsAppConversations();

  // Use analytics hook
  useTabAnalytics(activeTab);

  // Legacy fetchData function for backward compatibility
  const fetchData = useCallback(async (type) => {
    if (type === 'pedidos') {
      await pedidosContext.fetchPedidos();
    } else if (type === 'agendamentos') {
      await agendamentosContext.fetchAgendamentos();
    }
  }, [pedidosContext, agendamentosContext]);

  // Refresh all data
  const refreshAll = useCallback(() => {
    if (isAuthenticated) {
      pedidosContext.refreshPedidos();
      agendamentosContext.refreshAgendamentos();
      whatsappContext.refreshConversations();
    }
  }, [isAuthenticated, pedidosContext, agendamentosContext, whatsappContext]);

  // Initial data fetch when authenticated (no automatic polling)
  useEffect(() => {
    if (isAuthenticated) {
      refreshAll();
    }
  }, [isAuthenticated, refreshAll]);

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


