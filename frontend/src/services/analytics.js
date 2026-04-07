/**
 * Analytics Service
 * Gerencia o rastreamento de uso da aplicação:
 * - Tabs por superfície (tab_click, tab_session; coluna `surface`: dashboard, contatos, …)
 * - Superfícies app-level (surface_view, surface_session)
 * Dados persistidos no Supabase (tabela analytics_events)
 */

import { supabase } from '../infrastructure/supabase/config';

// ============================================================================
// TAB TRACKING (Dashboard, Contatos, etc.)
// ============================================================================

/**
 * Registra um evento de clique em uma tab
 * Ignora se o usuário for architect
 * @param {string} tabId - ID da tab
 * @param {string} tabName - Nome da tab
 * @param {string} userId - UUID do usuário
 * @param {string} role - Role do usuário
 * @param {string} [surface='dashboard'] - Superfície onde a tab existe ('dashboard', 'contatos', …)
 * @returns {Object|null} - Evento registrado ou null se ignorado
 */
export const trackTabClick = async (
  tabId,
  tabName,
  userId,
  role,
  surface = 'dashboard',
) => {
  if (role === 'architect' || !userId) return null;

  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: 'tab_click',
        tab_id: tabId,
        tab_name: tabName,
        surface,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao registrar clique:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao registrar clique:', error);
    return null;
  }
};

/**
 * Inicia o rastreamento de tempo em uma tab
 * Ignora se o usuário for architect
 * @param {string} tabId - ID da tab
 * @param {string} tabName - Nome da tab
 * @param {string} userId - UUID do usuário
 * @param {string} role - Role do usuário
 * @param {string} [surface='dashboard'] - Superfície onde a tab existe
 * @returns {string|null} - ID do evento de sessão ou null se ignorado
 */
export const startTabSession = async (
  tabId,
  tabName,
  userId,
  role,
  surface = 'dashboard',
) => {
  if (role === 'architect' || !userId) return null;

  const sessionId = `${tabId}_${Date.now()}`;

  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: 'tab_session',
        tab_id: tabId,
        tab_name: tabName,
        session_id: sessionId,
        surface,
        duration: null,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao iniciar sessão:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Erro ao iniciar sessão:', error);
    return null;
  }
};

/**
 * Finaliza o rastreamento de tempo (tab ou surface)
 * @param {string} eventId - ID do evento de sessão no banco
 * @param {Date} startTime - Timestamp de início da sessão
 * @returns {Object|null} - Sessão atualizada ou null
 */
export const endTabSession = async (eventId, startTime) => {
  if (!eventId) return null;

  const duration = Math.floor((new Date() - startTime) / 1000);

  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .update({ duration })
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao finalizar sessão:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao finalizar sessão:', error);
    return null;
  }
};

// ============================================================================
// SURFACE TRACKING (App-level navigation)
// ============================================================================

/**
 * Registra um evento de visualização de superfície app-level
 * Ignora se o usuário for architect
 * @param {string} surface - Nome da superfície ('dashboard', 'contatos', etc.)
 * @param {string} userId - UUID do usuário
 * @param {string} role - Role do usuário
 * @returns {Object|null} - Evento registrado ou null se ignorado
 */
export const trackSurfaceView = async (surface, userId, role) => {
  if (role === 'architect' || !userId || !surface) return null;

  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: 'surface_view',
        surface,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao registrar visualização de superfície:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao registrar visualização de superfície:', error);
    return null;
  }
};

/**
 * Inicia o rastreamento de tempo em uma superfície app-level
 * Ignora se o usuário for architect
 * @param {string} surface - Nome da superfície ('dashboard', 'contatos', etc.)
 * @param {string} userId - UUID do usuário
 * @param {string} role - Role do usuário
 * @returns {string|null} - ID do evento de sessão ou null se ignorado
 */
export const startSurfaceSession = async (surface, userId, role) => {
  if (role === 'architect' || !userId || !surface) return null;

  const sessionId = `${surface}_${Date.now()}`;

  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: 'surface_session',
        surface,
        session_id: sessionId,
        duration: null,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao iniciar sessão de superfície:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Erro ao iniciar sessão de superfície:', error);
    return null;
  }
};

// endSurfaceSession reutiliza endTabSession (mesma lógica de UPDATE com duration)
export const endSurfaceSession = endTabSession;

// ============================================================================
// STATISTICS & DATA
// ============================================================================

/**
 * Obtém estatísticas consolidadas de uso com breakdown por usuário
 * Inclui dados de tabs e superfícies
 * @param {number} days - Número de dias para filtrar (default: 7)
 * @returns {Object} - Estatísticas consolidadas
 */
export const getUsageStatistics = async (days = 7) => {
  try {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .order('timestamp', { ascending: true });

    // Filtro de período
    if (days < 9999) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      query = query.gte('timestamp', cutoffDate.toISOString());
    }

    const { data: events, error } = await query;

    if (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return { users: {}, surfaces: {}, totalClicks: 0, totalTime: 0, totalSurfaceViews: 0, totalSurfaceTime: 0, firstEvent: null, lastEvent: null };
    }

    // Agrupar por usuário
    const users = {};
    // Agregar superfícies globalmente
    const surfaces = {};

    const ensureTabBucket = (user, tabId) => {
      if (!tabId) return null;
      if (!user.tabs[tabId]) {
        user.tabs[tabId] = { clicks: 0, totalTime: 0, sessions: 0 };
      }
      return user.tabs[tabId];
    };

    events.forEach(event => {
      const uid = event.user_id;

      if (!users[uid]) {
        users[uid] = {
          userId: uid,
          email: uid,
          tabs: {},
          surfaces: {},
          totalClicks: 0,
          totalTime: 0,
          totalSurfaceViews: 0,
          totalSurfaceTime: 0,
          firstEvent: null,
          lastEvent: null,
        };
      }

      const user = users[uid];

      // Tab events
      if (event.event_type === 'tab_click' && event.tab_id) {
        user.totalClicks++;
        const bucket = ensureTabBucket(user, event.tab_id);
        bucket.clicks++;
        if (!user.firstEvent) user.firstEvent = event.timestamp;
        user.lastEvent = event.timestamp;
      }

      if (
        event.event_type === 'tab_session' &&
        event.duration !== null &&
        event.tab_id
      ) {
        const bucket = ensureTabBucket(user, event.tab_id);
        bucket.totalTime += event.duration;
        bucket.sessions++;
        user.totalTime += event.duration;
      }

      // Surface events
      if (event.event_type === 'surface_view' && event.surface) {
        user.totalSurfaceViews++;

        if (!user.surfaces[event.surface]) {
          user.surfaces[event.surface] = { views: 0, totalTime: 0, sessions: 0 };
        }
        user.surfaces[event.surface].views++;

        // Global surfaces
        if (!surfaces[event.surface]) {
          surfaces[event.surface] = { views: 0, totalTime: 0, sessions: 0 };
        }
        surfaces[event.surface].views++;

        if (!user.firstEvent) user.firstEvent = event.timestamp;
        user.lastEvent = event.timestamp;
      }

      if (event.event_type === 'surface_session' && event.surface && event.duration !== null) {
        user.totalSurfaceTime += event.duration;

        if (!user.surfaces[event.surface]) {
          user.surfaces[event.surface] = { views: 0, totalTime: 0, sessions: 0 };
        }
        user.surfaces[event.surface].totalTime += event.duration;
        user.surfaces[event.surface].sessions++;

        // Global surfaces
        if (!surfaces[event.surface]) {
          surfaces[event.surface] = { views: 0, totalTime: 0, sessions: 0 };
        }
        surfaces[event.surface].totalTime += event.duration;
        surfaces[event.surface].sessions++;
      }
    });

    // Calcular médias por tab por usuário
    Object.values(users).forEach(user => {
      Object.keys(user.tabs).forEach(tabId => {
        const tab = user.tabs[tabId];
        tab.averageTime = tab.sessions > 0 ? Math.floor(tab.totalTime / tab.sessions) : 0;
      });
      // Calcular médias por surface por usuário
      Object.keys(user.surfaces).forEach(surfaceId => {
        const surface = user.surfaces[surfaceId];
        surface.averageTime = surface.sessions > 0 ? Math.floor(surface.totalTime / surface.sessions) : 0;
      });
    });

    // Médias globais de surfaces
    Object.keys(surfaces).forEach(surfaceId => {
      const surface = surfaces[surfaceId];
      surface.averageTime = surface.sessions > 0 ? Math.floor(surface.totalTime / surface.sessions) : 0;
    });

    // Totais globais
    const globalStats = {
      users,
      surfaces,
      totalClicks: Object.values(users).reduce((sum, u) => sum + u.totalClicks, 0),
      totalTime: Object.values(users).reduce((sum, u) => sum + u.totalTime, 0),
      totalSurfaceViews: Object.values(users).reduce((sum, u) => sum + u.totalSurfaceViews, 0),
      totalSurfaceTime: Object.values(users).reduce((sum, u) => sum + u.totalSurfaceTime, 0),
      firstEvent: events.length > 0 ? events[0].timestamp : null,
      lastEvent: events.length > 0 ? events[events.length - 1].timestamp : null,
    };

    return globalStats;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return { users: {}, surfaces: {}, totalClicks: 0, totalTime: 0, totalSurfaceViews: 0, totalSurfaceTime: 0, firstEvent: null, lastEvent: null };
  }
};

/**
 * Limpa todos os dados de analytics do banco
 * @returns {boolean} - Sucesso ou falha
 */
export const clearAnalyticsData = async () => {
  try {
    const { error } = await supabase
      .from('analytics_events')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      console.error('Erro ao limpar dados de analytics:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao limpar dados de analytics:', error);
    return false;
  }
};

/**
 * Exporta dados de analytics em formato JSON
 * @param {number} days - Número de dias para exportar
 * @returns {Object} - Dados exportados
 */
export const exportAnalyticsData = async (days = 9999) => {
  const stats = await getUsageStatistics(days);

  let query = supabase
    .from('analytics_events')
    .select('*')
    .order('timestamp', { ascending: true });

  if (days < 9999) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    query = query.gte('timestamp', cutoffDate.toISOString());
  }

  const { data: events } = await query;

  return {
    rawData: { events: events || [] },
    statistics: stats,
    exportedAt: new Date().toISOString(),
  };
};
