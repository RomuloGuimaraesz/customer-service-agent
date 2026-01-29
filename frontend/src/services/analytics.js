/**
 * Analytics Service
 * Gerencia o rastreamento de uso da aplicação (cliques em tabs, tempo de permanência, etc.)
 */

const STORAGE_KEY = 'rapidy_analytics';
const MAX_STORAGE_SIZE = 1000; // Número máximo de eventos a armazenar

/**
 * Recupera todos os dados de analytics do localStorage
 */
export const getAnalyticsData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { events: [], sessions: {} };
  } catch (error) {
    console.error('Erro ao recuperar dados de analytics:', error);
    return { events: [], sessions: {} };
  }
};

/**
 * Salva dados de analytics no localStorage
 */
const saveAnalyticsData = (data) => {
  try {
    // Limitar tamanho do storage
    if (data.events.length > MAX_STORAGE_SIZE) {
      data.events = data.events.slice(-MAX_STORAGE_SIZE);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar dados de analytics:', error);
    // Se o storage estiver cheio, limpar eventos mais antigos
    if (error.name === 'QuotaExceededError') {
      data.events = data.events.slice(-Math.floor(MAX_STORAGE_SIZE / 2));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Erro ao tentar salvar após limpeza:', e);
      }
    }
  }
};

/**
 * Registra um evento de clique em uma tab
 */
export const trackTabClick = (tabId, tabName) => {
  const data = getAnalyticsData();
  const event = {
    type: 'tab_click',
    tabId,
    tabName,
    timestamp: new Date().toISOString(),
  };
  data.events.push(event);
  saveAnalyticsData(data);
  return event;
};

/**
 * Inicia o rastreamento de tempo em uma tab
 */
export const startTabSession = (tabId, tabName) => {
  const data = getAnalyticsData();
  const sessionId = `${tabId}_${Date.now()}`;
  
  if (!data.sessions) {
    data.sessions = {};
  }
  
  data.sessions[sessionId] = {
    tabId,
    tabName,
    startTime: new Date().toISOString(),
    endTime: null,
    duration: null,
  };
  
  saveAnalyticsData(data);
  return sessionId;
};

/**
 * Finaliza o rastreamento de tempo em uma tab
 */
export const endTabSession = (sessionId) => {
  const data = getAnalyticsData();
  
  if (data.sessions && data.sessions[sessionId]) {
    const session = data.sessions[sessionId];
    const endTime = new Date();
    const startTime = new Date(session.startTime);
    const duration = Math.floor((endTime - startTime) / 1000); // Duração em segundos
    
    session.endTime = endTime.toISOString();
    session.duration = duration;
    
    // Adicionar evento de sessão finalizada
    data.events.push({
      type: 'tab_session',
      tabId: session.tabId,
      tabName: session.tabName,
      duration,
      timestamp: endTime.toISOString(),
    });
    
    saveAnalyticsData(data);
    return session;
  }
  
  return null;
};

/**
 * Obtém estatísticas consolidadas de uso
 */
export const getUsageStatistics = () => {
  const data = getAnalyticsData();
  const stats = {
    tabs: {
      agendamentos: { clicks: 0, totalTime: 0, sessions: 0 },
      pedidos: { clicks: 0, totalTime: 0, sessions: 0 },
      whatsapp: { clicks: 0, totalTime: 0, sessions: 0 },
    },
    totalClicks: 0,
    totalTime: 0,
    firstEvent: null,
    lastEvent: null,
  };

  // Processar eventos de clique
  data.events.forEach(event => {
    if (event.type === 'tab_click') {
      stats.totalClicks++;
      if (stats.tabs[event.tabId]) {
        stats.tabs[event.tabId].clicks++;
      }
      
      if (!stats.firstEvent) stats.firstEvent = event.timestamp;
      stats.lastEvent = event.timestamp;
    }
    
    if (event.type === 'tab_session') {
      if (stats.tabs[event.tabId]) {
        stats.tabs[event.tabId].totalTime += event.duration;
        stats.tabs[event.tabId].sessions++;
        stats.totalTime += event.duration;
      }
    }
  });

  // Processar sessões ainda ativas (não finalizadas)
  if (data.sessions) {
    Object.values(data.sessions).forEach(session => {
      if (session.endTime === null && stats.tabs[session.tabId]) {
        // Sessão ainda ativa - calcular tempo parcial
        const startTime = new Date(session.startTime);
        const now = new Date();
        const partialDuration = Math.floor((now - startTime) / 1000);
        stats.tabs[session.tabId].totalTime += partialDuration;
        stats.totalTime += partialDuration;
      }
    });
  }

  // Calcular médias
  Object.keys(stats.tabs).forEach(tabId => {
    const tab = stats.tabs[tabId];
    if (tab.sessions > 0) {
      tab.averageTime = Math.floor(tab.totalTime / tab.sessions);
    } else {
      tab.averageTime = 0;
    }
  });

  return stats;
};

/**
 * Obtém histórico de eventos por período
 */
export const getEventsByPeriod = (days = 7) => {
  const data = getAnalyticsData();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return data.events.filter(event => {
    const eventDate = new Date(event.timestamp);
    return eventDate >= cutoffDate;
  });
};

/**
 * Limpa todos os dados de analytics
 */
export const clearAnalyticsData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados de analytics:', error);
    return false;
  }
};

/**
 * Exporta dados de analytics em formato JSON
 */
export const exportAnalyticsData = () => {
  const data = getAnalyticsData();
  const stats = getUsageStatistics();
  return {
    rawData: data,
    statistics: stats,
    exportedAt: new Date().toISOString(),
  };
};


































