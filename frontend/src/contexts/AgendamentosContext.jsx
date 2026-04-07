import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { UseCaseFactory } from '../domain/useCaseFactory.js';
import { agendamentosReducer, initialAgendamentosState, AGENDAMENTOS_ACTIONS } from '../reducers/agendamentosReducer';

/**
 * Agendamentos Context - Focused context for agendamentos state management
 */
const AgendamentosContext = createContext(null);

export const useAgendamentos = () => {
  const context = useContext(AgendamentosContext);
  if (!context) {
    throw new Error('useAgendamentos must be used within AgendamentosProvider');
  }
  return context;
};

export const AgendamentosProvider = ({ children }) => {
  const { getAuthHeader } = useAuth();
  const [state, dispatch] = useReducer(agendamentosReducer, initialAgendamentosState);

  // Fetch agendamentos using Clean Architecture
  const fetchAgendamentos = useCallback(async () => {
    const authHeader = getAuthHeader();

    // Don't fetch if not authenticated
    if (!authHeader) {
      return;
    }

    dispatch({ type: AGENDAMENTOS_ACTIONS.FETCH_START });

    try {
      const fetchAgendamentosUseCase = UseCaseFactory.createFetchAgendamentos(authHeader);
      const result = await fetchAgendamentosUseCase.execute(authHeader);

      if (result.success) {
        dispatch({ type: AGENDAMENTOS_ACTIONS.FETCH_SUCCESS, payload: result.data });
      } else {
        throw new Error(`Failed to fetch agendamentos: ${result.error}`);
      }
    } catch (err) {
      dispatch({ type: AGENDAMENTOS_ACTIONS.FETCH_ERROR, payload: err.message });
      // For agendamentos, do not fallback to mock data: keep UI truthful to API state.
      dispatch({ type: AGENDAMENTOS_ACTIONS.FETCH_SUCCESS, payload: [], preserveError: true });
    }
  }, [getAuthHeader]);

  // Refresh agendamentos data
  const refreshAgendamentos = useCallback(() => {
    return fetchAgendamentos();
  }, [fetchAgendamentos]);

  const value = {
    agendamentos: state.agendamentos,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    fetchAgendamentos,
    refreshAgendamentos,
  };

  return (
    <AgendamentosContext.Provider value={value}>
      {children}
    </AgendamentosContext.Provider>
  );
};
