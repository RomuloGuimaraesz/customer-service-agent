import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { MOCK_DATA } from '../data/mockData';
import { UseCaseFactory } from '../domain/useCaseFactory.js';

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
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch agendamentos using Clean Architecture
  const fetchAgendamentos = useCallback(async () => {
    const authHeader = getAuthHeader();

    // Don't fetch if not authenticated
    if (!authHeader) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchAgendamentosUseCase = UseCaseFactory.createFetchAgendamentos(authHeader);
      const result = await fetchAgendamentosUseCase.execute(authHeader);

      if (result.success) {
        setAgendamentos(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(`Failed to fetch agendamentos: ${result.error}`);
      }
    } catch (err) {
      setError(err.message);
      // Load mock data for demo (fallback behavior)
      setAgendamentos(MOCK_DATA.agendamentos);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  // Refresh agendamentos data
  const refreshAgendamentos = useCallback(() => {
    return fetchAgendamentos();
  }, [fetchAgendamentos]);

  const value = {
    agendamentos,
    loading,
    error,
    lastUpdated,
    fetchAgendamentos,
    refreshAgendamentos,
  };

  return (
    <AgendamentosContext.Provider value={value}>
      {children}
    </AgendamentosContext.Provider>
  );
};
