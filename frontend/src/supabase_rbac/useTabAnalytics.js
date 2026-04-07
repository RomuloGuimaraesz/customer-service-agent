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
 * @param {Record<string, string>} [options.tabNames] - Mapa tab id → rótulo
 */
export const useTabAnalytics = (activeTab, userId, role, options = {}) => {
  const currentSessionRef = useRef(null);

  const surface = options.surface ?? 'dashboard';
  const tabNames = options.tabNames ?? DEFAULT_DASHBOARD_TAB_NAMES;

  const shouldTrack = role !== 'architect' && !!userId;

  useEffect(() => {
    if (!shouldTrack || !activeTab) return;

    if (currentSessionRef.current) {
      endTabSession(currentSessionRef.current.eventId, currentSessionRef.current.startTime);
    }

    const tabName = tabNames[activeTab] || activeTab;

    trackTabClick(activeTab, tabName, userId, role, surface);

    const startTime = new Date();
    startTabSession(activeTab, tabName, userId, role, surface)
      .then((eventId) => {
        if (eventId) {
          currentSessionRef.current = { eventId, startTime };
        }
      });

    return () => {
      if (currentSessionRef.current) {
        endTabSession(currentSessionRef.current.eventId, currentSessionRef.current.startTime);
        currentSessionRef.current = null;
      }
    };
  }, [activeTab, shouldTrack, userId, role, surface, tabNames]);

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

  return {};
};
