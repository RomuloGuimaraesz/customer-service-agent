import { useMemo } from 'react';
import {
  CALENDAR_ICON,
  DOCUMENT_ICON,
  WARNING_ICON,
  MESSAGE_ICON,
} from '../config/icons';

/**
 * Custom hook to calculate dashboard statistics
 *
 * @param {Array} pedidos - Array of pedidos (orders)
 * @param {Array} agendamentos - Array of agendamentos (appointments)
 * @param {Array} atendimentos - Array of atendimentos
 * @returns {Object} Object containing statsValues and stats array
 */
export const useDashboardStats = (pedidos = [], agendamentos = [], atendimentos = []) => {
  // Calculate stats values
  const statsValues = useMemo(() => {
    return {
      totalPedidos: pedidos.length,
      pedidosPendentes: pedidos.filter(p =>
        p.Status?.toLowerCase().includes('em andamento')
      ).length,
      totalAgendamentos: agendamentos.length,
      totalAtendimentos: atendimentos.length,
    };
  }, [pedidos, agendamentos, atendimentos]);

  // Prepare stats array for StatsGrid
  const stats = useMemo(() => [
    {
      iconSvg: CALENDAR_ICON,
      label: 'Agendamentos',
      value: statsValues.totalAgendamentos,
    },
    {
      iconSvg: DOCUMENT_ICON,
      label: 'Pedidos',
      value: statsValues.totalPedidos,
    },
    {
      iconSvg: WARNING_ICON,
      label: 'Pendentes',
      value: statsValues.pedidosPendentes,
    },
    {
      iconSvg: MESSAGE_ICON,
      label: 'Atendimentos',
      value: statsValues.totalAtendimentos,
    },
  ], [statsValues]);

  return {
    statsValues,
    stats,
  };
};

