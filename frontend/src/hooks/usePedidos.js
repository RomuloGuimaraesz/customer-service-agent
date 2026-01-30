import { usePedidos as usePedidosContext } from '../contexts/PedidosContext';

/**
 * Custom hook for pedidos data fetching
 * 
 * This hook wraps the PedidosContext hook and provides a clean interface
 * for accessing pedidos data, loading states, error states, and fetching functions.
 * 
 * @returns {Object} Object containing:
 *   - pedidos: Array of pedidos
 *   - loading: Boolean indicating if data is being fetched
 *   - error: Error message if fetch failed, null otherwise
 *   - lastUpdated: Date when data was last successfully fetched
 *   - fetchPedidos: Function to manually fetch pedidos
 *   - refreshPedidos: Function to refresh pedidos data (alias for fetchPedidos)
 * 
 * @example
 * const { pedidos, loading, error, refreshPedidos } = usePedidos();
 */
export const usePedidos = () => {
  return usePedidosContext();
};


















