import { useEffect, useRef } from 'react';
import { trackSurfaceView, startSurfaceSession, endSurfaceSession } from '../services/analytics';

/**
 * Custom hook for handling app-level surface analytics tracking
 * Tracks which top-level surface (dashboard, contatos, etc.) the user is on
 * and measures time spent on each surface.
 *
 * @param {string|null} surface - Current active surface ('dashboard', 'contatos', etc.)
 * @param {string} userId - UUID do usuário autenticado
 * @param {string} role - Role do usuário ('architect', 'admin', etc.)
 * @returns {Object} - Hook interface (currently empty, can be extended)
 */
export const useSurfaceAnalytics = (surface, userId, role) => {
  const currentSessionRef = useRef(null);

  // Não rastrear se for architect ou sem userId
  const shouldTrack = role !== 'architect' && !!userId;

  // Rastreamento de analytics para mudanças de superfície
  useEffect(() => {
    if (!shouldTrack || !surface) return;

    // Finalizar sessão anterior, se houver
    if (currentSessionRef.current) {
      endSurfaceSession(currentSessionRef.current.eventId, currentSessionRef.current.startTime);
    }

    // Registrar visualização da superfície
    trackSurfaceView(surface, userId, role);

    // Iniciar nova sessão
    const startTime = new Date();
    startSurfaceSession(surface, userId, role)
      .then((eventId) => {
        if (eventId) {
          currentSessionRef.current = { eventId, startTime };
        }
      });

    // Cleanup: finalizar sessão quando superfície mudar
    return () => {
      if (currentSessionRef.current) {
        endSurfaceSession(currentSessionRef.current.eventId, currentSessionRef.current.startTime);
        currentSessionRef.current = null;
      }
    };
  }, [surface, shouldTrack, userId, role]);

  // Finalizar sessão quando o usuário sair ou fechar a página
  useEffect(() => {
    if (!shouldTrack) return;

    const handleBeforeUnload = () => {
      if (currentSessionRef.current) {
        endSurfaceSession(currentSessionRef.current.eventId, currentSessionRef.current.startTime);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (currentSessionRef.current) {
        endSurfaceSession(currentSessionRef.current.eventId, currentSessionRef.current.startTime);
      }
    };
  }, [shouldTrack]);

  return {};
};
