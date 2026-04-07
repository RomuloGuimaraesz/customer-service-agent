import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { UseCaseFactory } from '../domain/useCaseFactory.js';
import { pedidosReducer, initialPedidosState, PEDIDOS_ACTIONS } from '../reducers/pedidosReducer';

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
  const [state, dispatch] = useReducer(pedidosReducer, initialPedidosState);

  // Fetch pedidos using Clean Architecture
  const fetchPedidos = useCallback(async () => {
    const authHeader = getAuthHeader();

    // Don't fetch if not authenticated
    if (!authHeader) {
      return;
    }

    dispatch({ type: PEDIDOS_ACTIONS.FETCH_START });

    try {
      const fetchPedidosUseCase = UseCaseFactory.createFetchPedidos(authHeader);
      const result = await fetchPedidosUseCase.execute(authHeader);

      if (result.success) {
        dispatch({ type: PEDIDOS_ACTIONS.FETCH_SUCCESS, payload: result.data });
      } else {
        throw new Error(`Failed to fetch pedidos: ${result.error}`);
      }
    } catch (err) {
      dispatch({ type: PEDIDOS_ACTIONS.FETCH_ERROR, payload: err.message });
      dispatch({ type: PEDIDOS_ACTIONS.FETCH_SUCCESS, payload: [], preserveError: true });
    }
  }, [getAuthHeader]);

  // Refresh pedidos data
  const refreshPedidos = useCallback(() => {
    return fetchPedidos();
  }, [fetchPedidos]);

  const value = {
    pedidos: state.pedidos,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    fetchPedidos,
    refreshPedidos,
  };

  return (
    <PedidosContext.Provider value={value}>
      {children}
    </PedidosContext.Provider>
  );
};
