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
 * @returns {Object} Object containing statsValues and stats array
 */
export const useDashboardStats = (pedidos = [], agendamentos = []) => {
  // Calculate stats values
  const statsValues = useMemo(() => {
    const today = new Date().toLocaleDateString('pt-BR');
    
    return {
      totalPedidos: pedidos.length,
      pedidosPendentes: pedidos.filter(p =>
        p.Status?.toLowerCase().includes('aguardando') ||
        p.Status?.toLowerCase().includes('produção')
      ).length,
      totalAgendamentos: agendamentos.length,
      agendamentosHoje: agendamentos.filter(a =>
        a.Data?.includes(today)
      ).length,
    };
  }, [pedidos, agendamentos]);

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
      label: 'Hoje',
      value: statsValues.agendamentosHoje,
    },
  ], [statsValues]);

  return {
    statsValues,
    stats,
  };
};

