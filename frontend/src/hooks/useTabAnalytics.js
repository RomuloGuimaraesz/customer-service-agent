import { useEffect, useRef } from 'react';
import { trackTabClick, startTabSession, endTabSession } from '../services/analytics';

/**
 * Custom hook for handling tab analytics tracking
 * @param {string} activeTab - Current active tab
 * @returns {Object} - Hook interface (currently empty, but can be extended)
 */
export const useTabAnalytics = (activeTab) => {
  const currentSessionRef = useRef(null);

  const tabNames = {
    agendamentos: 'Agendamentos',
    pedidos: 'Pedidos',
    whatsapp: 'WhatsApp',
  };

  // Rastreamento de analytics para mudanças de tab
  useEffect(() => {
    if (activeTab) {
      // Finalizar sessão anterior, se houver
      if (currentSessionRef.current) {
        endTabSession(currentSessionRef.current);
      }

      // Registrar clique na tab
      trackTabClick(activeTab, tabNames[activeTab] || activeTab);

      // Iniciar nova sessão
      currentSessionRef.current = startTabSession(activeTab, tabNames[activeTab] || activeTab);
    }

    // Cleanup: finalizar sessão quando o componente for desmontado ou tab mudar
    return () => {
      if (currentSessionRef.current) {
        endTabSession(currentSessionRef.current);
        currentSessionRef.current = null;
      }
    };
  }, [activeTab]);

  // Finalizar sessão quando o usuário sair ou fechar a página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentSessionRef.current) {
        endTabSession(currentSessionRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (currentSessionRef.current) {
        endTabSession(currentSessionRef.current);
      }
    };
  }, []);

  // Return empty object for now - can be extended with analytics methods if needed
  return {};
};

















