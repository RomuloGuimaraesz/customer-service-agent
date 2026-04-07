import { useEffect, useRef } from 'react';
import { trackTabClick, startTabSession, endTabSession } from '../services/analytics';

const DEFAULT_DASHBOARD_TAB_NAMES = {
  agendamentos: 'Agendamentos',
  atendimentos: 'Atendimentos',
  pedidos: 'Pedidos',
  whatsapp: 'WhatsApp',
};

/**
 * Custom hook for handling tab analytics tracking
 * @param {string} activeTab - Current active tab
 * @param {string} userId - UUID do usuário autenticado
 * @param {string} role - Role do usuário ('architect', 'admin', etc.)
 * @param {Object} [options]
 * @param {string} [options.surface='dashboard'] - Superfície (ex.: 'contatos')
 * @param {Record<string, string>} [options.tabNames] - Mapa tab id → rótulo (default: abas do dashboard)
 * @returns {Object} - Hook interface (currently empty, but can be extended)
 */
export const useTabAnalytics = (activeTab, userId, role, options = {}) => {
  const currentSessionRef = useRef(null);

  const surface = options.surface ?? 'dashboard';
  const tabNames = options.tabNames ?? DEFAULT_DASHBOARD_TAB_NAMES;

  // Não rastrear se for architect ou sem userId
  const shouldTrack = role !== 'architect' && !!userId;

  // Rastreamento de analytics para mudanças de tab
  useEffect(() => {
    if (!shouldTrack || !activeTab) return;

    // Finalizar sessão anterior, se houver
    if (currentSessionRef.current) {
      endTabSession(currentSessionRef.current.eventId, currentSessionRef.current.startTime);
    }

    const tabName = tabNames[activeTab] || activeTab;

    // Registrar clique na tab
    trackTabClick(activeTab, tabName, userId, role, surface);

    // Iniciar nova sessão
    const startTime = new Date();
    startTabSession(activeTab, tabName, userId, role, surface)
      .then((eventId) => {
        if (eventId) {
          currentSessionRef.current = { eventId, startTime };
        }
      });

    // Cleanup: finalizar sessão quando tab mudar
    return () => {
      if (currentSessionRef.current) {
        endTabSession(currentSessionRef.current.eventId, currentSessionRef.current.startTime);
        currentSessionRef.current = null;
      }
    };
  }, [activeTab, shouldTrack, userId, role, surface, tabNames]);

  // Finalizar sessão quando o usuário sair ou fechar a página
  useEffect(() => {
    if (!shouldTrack) return;

    const handleBeforeUnload = () => {
      if (currentSessionRef.current) {
        endTabSession(currentSessionRef.current.eventId, currentSessionRef.current.startTime);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (currentSessionRef.current) {
        endTabSession(currentSessionRef.current.eventId, currentSessionRef.current.startTime);
      }
    };
  }, [shouldTrack]);

  // Return empty object for now - can be extended with analytics methods if needed
  return {};
};
