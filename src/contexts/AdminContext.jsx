import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { CONFIG } from '../config/constants';
import { MOCK_DATA } from '../data/mockData';

/**
 * Admin Data Context
 */
const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { getAuthHeader, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState({ pedidos: false, agendamentos: false });
  const [error, setError] = useState({ pedidos: null, agendamentos: null });
  const [lastUpdated, setLastUpdated] = useState({ pedidos: null, agendamentos: null });
  const [activeTab, setActiveTab] = useState('pedidos');

  // Fetch data with Basic Auth
  const fetchData = useCallback(async (type) => {
    const authHeader = getAuthHeader();
    if (!authHeader) return;

    setLoading(prev => ({ ...prev, [type]: true }));
    setError(prev => ({ ...prev, [type]: null }));

    try {
      const response = await fetch(CONFIG.API_ENDPOINTS[type], {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        throw new Error('Não autorizado - verifique suas credenciais');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (type === 'pedidos') {
        setPedidos(Array.isArray(data) ? data : []);
      } else {
        setAgendamentos(Array.isArray(data) ? data : []);
      }

      setLastUpdated(prev => ({ ...prev, [type]: new Date() }));
    } catch (err) {
      setError(prev => ({ ...prev, [type]: err.message }));

      // Load mock data for demo
      if (type === 'pedidos') {
        setPedidos(MOCK_DATA.pedidos);
      } else {
        setAgendamentos(MOCK_DATA.agendamentos);
      }
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  }, [getAuthHeader]);

  const refreshAll = useCallback(() => {
    if (isAuthenticated) {
      fetchData('pedidos');
      fetchData('agendamentos');
    }
  }, [fetchData, isAuthenticated]);

  // Initial data fetch when authenticated (no automatic polling)
  useEffect(() => {
    if (isAuthenticated) {
      refreshAll();
    }
  }, [isAuthenticated, refreshAll]);

  const value = {
    pedidos,
    agendamentos,
    loading,
    error,
    lastUpdated,
    activeTab,
    setActiveTab,
    fetchData,
    refreshAll,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};


