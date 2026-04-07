/**
 * Analytics Service
 * Gerencia o rastreamento de uso da aplicação (cliques em tabs, tempo de permanência, etc.)
 * Dados persistidos no Supabase (tabela analytics_events)
 */

import { supabase } from '../infrastructure/supabase/config';

/**
 * Registra um evento de clique em uma tab
 * Ignora se o usuário for architect
 * @param {string} tabId - ID da tab
 * @param {string} tabName - Nome da tab
 * @param {string} userId - UUID do usuário
 * @param {string} role - Role do usuário
 * @returns {Object|null} - Evento registrado ou null se ignorado
 */
export const trackTabClick = async (tabId, tabName, userId, role) => {
  if (role === 'architect' || !userId) return null;

  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: 'tab_click',
        tab_id: tabId,
        tab_name: tabName,
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
 * @returns {string|null} - ID do evento de sessão ou null se ignorado
 */
export const startTabSession = async (tabId, tabName, userId, role) => {
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
 * Finaliza o rastreamento de tempo em uma tab
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

/**
 * Obtém estatísticas consolidadas de uso com breakdown por usuário
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
      return { users: {}, totalClicks: 0, totalTime: 0, firstEvent: null, lastEvent: null };
    }

    // Buscar emails dos usuários via auth (usando user_ids únicos dos eventos)
    const userIds = [...new Set(events.map(e => e.user_id))];
    const userEmails = {};

    for (const uid of userIds) {
      // Tentar buscar o email do usuário nos próprios eventos não é possível,
      // então usamos uma abordagem: buscar via admin ou manter apenas o user_id.
      // Como não temos acesso admin no frontend, vamos buscar via rpc ou manter user_id.
      userEmails[uid] = uid; // Será substituído abaixo se conseguirmos o email
    }

    // Agrupar por usuário
    const users = {};

    events.forEach(event => {
      const uid = event.user_id;

      if (!users[uid]) {
        users[uid] = {
          userId: uid,
          email: userEmails[uid] || uid,
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
      }

      const user = users[uid];

      if (event.event_type === 'tab_click') {
        user.totalClicks++;
        if (user.tabs[event.tab_id]) {
          user.tabs[event.tab_id].clicks++;
        }

        if (!user.firstEvent) user.firstEvent = event.timestamp;
        user.lastEvent = event.timestamp;
      }

      if (event.event_type === 'tab_session' && event.duration !== null) {
        if (user.tabs[event.tab_id]) {
          user.tabs[event.tab_id].totalTime += event.duration;
          user.tabs[event.tab_id].sessions++;
          user.totalTime += event.duration;
        }
      }
    });

    // Calcular médias por tab por usuário
    Object.values(users).forEach(user => {
      Object.keys(user.tabs).forEach(tabId => {
        const tab = user.tabs[tabId];
        tab.averageTime = tab.sessions > 0 ? Math.floor(tab.totalTime / tab.sessions) : 0;
      });
    });

    // Totais globais
    const globalStats = {
      users,
      totalClicks: Object.values(users).reduce((sum, u) => sum + u.totalClicks, 0),
      totalTime: Object.values(users).reduce((sum, u) => sum + u.totalTime, 0),
      firstEvent: events.length > 0 ? events[0].timestamp : null,
      lastEvent: events.length > 0 ? events[events.length - 1].timestamp : null,
    };

    return globalStats;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return { users: {}, totalClicks: 0, totalTime: 0, firstEvent: null, lastEvent: null };
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
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

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
