import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getAtendimentos } from '../services/atendimentosApi';
import {
  atendimentosReducer,
  initialAtendimentosState,
  ATENDIMENTOS_ACTIONS,
} from '../reducers/atendimentosReducer';

/**
 * Atendimentos Context - Focused context for atendimentos state management
 */
const AtendimentosContext = createContext(null);

export const useAtendimentos = () => {
  const context = useContext(AtendimentosContext);
  if (!context) {
    throw new Error('useAtendimentos must be used within AtendimentosProvider');
  }
  return context;
};

export const AtendimentosProvider = ({ children }) => {
  const { getAuthHeader } = useAuth();
  const [state, dispatch] = useReducer(atendimentosReducer, initialAtendimentosState);

  const fetchAtendimentos = useCallback(async () => {
    const authHeader = getAuthHeader();

    if (!authHeader) {
      return;
    }

    dispatch({ type: ATENDIMENTOS_ACTIONS.FETCH_START });

    try {
      const rows = await getAtendimentos(authHeader);
      dispatch({ type: ATENDIMENTOS_ACTIONS.FETCH_SUCCESS, payload: rows });
    } catch (err) {
      dispatch({ type: ATENDIMENTOS_ACTIONS.FETCH_ERROR, payload: err.message });
      dispatch({
        type: ATENDIMENTOS_ACTIONS.FETCH_SUCCESS,
        payload: [],
        preserveError: true,
      });
    }
  }, [getAuthHeader]);

  const refreshAtendimentos = useCallback(() => {
    return fetchAtendimentos();
  }, [fetchAtendimentos]);

  const value = {
    atendimentos: state.atendimentos,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    fetchAtendimentos,
    refreshAtendimentos,
  };

  return (
    <AtendimentosContext.Provider value={value}>
      {children}
    </AtendimentosContext.Provider>
  );
};
