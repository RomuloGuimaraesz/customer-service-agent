import { useAgendamentos as useAgendamentosContext } from '../contexts/AgendamentosContext';

/**
 * Custom hook for agendamentos data fetching
 * 
 * This hook wraps the AgendamentosContext hook and provides a clean interface
 * for accessing agendamentos data, loading states, error states, and fetching functions.
 * 
 * @returns {Object} Object containing:
 *   - agendamentos: Array of agendamentos
 *   - loading: Boolean indicating if data is being fetched
 *   - error: Error message if fetch failed, null otherwise
 *   - lastUpdated: Date when data was last successfully fetched
 *   - fetchAgendamentos: Function to manually fetch agendamentos
 *   - refreshAgendamentos: Function to refresh agendamentos data (alias for fetchAgendamentos)
 * 
 * @example
 * const { agendamentos, loading, error, refreshAgendamentos } = useAgendamentos();
 */
export const useAgendamentos = () => {
  return useAgendamentosContext();
};

