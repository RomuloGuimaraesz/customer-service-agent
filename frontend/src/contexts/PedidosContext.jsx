import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { MOCK_DATA } from '../data/mockData';
import { UseCaseFactory } from '../domain/useCaseFactory.js';

/**
 * Pedidos Context - Focused context for pedidos state management
 */
const PedidosContext = createContext(null);

export const usePedidos = () => {
  const context = useContext(PedidosContext);
  if (!context) {
    throw new Error('usePedidos must be used within PedidosProvider');
  }
  return context;
};

export const PedidosProvider = ({ children }) => {
  const { getAuthHeader } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch pedidos using Clean Architecture
  const fetchPedidos = useCallback(async () => {
    const authHeader = getAuthHeader();

    // Don't fetch if not authenticated
    if (!authHeader) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchPedidosUseCase = UseCaseFactory.createFetchPedidos(authHeader);
      const result = await fetchPedidosUseCase.execute(authHeader);

      if (result.success) {
        setPedidos(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(`Failed to fetch pedidos: ${result.error}`);
      }
    } catch (err) {
      setError(err.message);
      // Load mock data for demo (fallback behavior)
      setPedidos(MOCK_DATA.pedidos);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  // Refresh pedidos data
  const refreshPedidos = useCallback(() => {
    return fetchPedidos();
  }, [fetchPedidos]);

  const value = {
    pedidos,
    loading,
    error,
    lastUpdated,
    fetchPedidos,
    refreshPedidos,
  };

  return (
    <PedidosContext.Provider value={value}>
      {children}
    </PedidosContext.Provider>
  );
};
