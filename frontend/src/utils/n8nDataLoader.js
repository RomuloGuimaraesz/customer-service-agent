/**
 * n8n Data Loader for GovTech POC
 * Fetches data from n8n webhook endpoints
 */

import { CONFIG } from '../config/constants.js';
import { fetchApi } from '../services/apiService.js';

/**
 * Get authentication header for n8n webhooks
 * n8n webhooks use basicAuth - format: "Basic base64(username:password)"
 * For now, using empty auth (can be configured later)
 */
function getAuthHeader() {
  // TODO: Get from environment or user config
  // For basic auth: const credentials = btoa(`${username}:${password}`);
  // return `Basic ${credentials}`;
  return null;
}

/**
 * Fetch data from n8n endpoint
 */
async function fetchFromN8n(endpoint) {
  try {
    const response = await fetchApi(endpoint, { authHeader: getAuthHeader() });
    // n8n returns { data: [...] } format
    return response?.data || (Array.isArray(response) ? response : []);
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    // Return empty array on error to prevent app crash
    return [];
  }
}

/**
 * Get all atendimentos data from n8n
 * Note: n8n flow doesn't have atendimentos endpoint yet, so we'll use CSV as fallback
 */
export async function getAtendimentos() {
  // For now, fallback to CSV data since atendimentos endpoint not in n8n flow
  // Can be added to n8n workflow later
  try {
    const { getAtendimentos: getAtendimentosCSV } = await import('./csvDataLoader.js');
    return getAtendimentosCSV();
  } catch (error) {
    console.warn('CSV fallback not available, returning empty array');
    return [];
  }
}

/**
 * Get all pedidos data from n8n
 */
export async function getPedidos() {
  return await fetchFromN8n(CONFIG.API_ENDPOINTS.pedidos);
}

/**
 * Get all agendamentos data from n8n
 */
export async function getAgendamentos() {
  return await fetchFromN8n(CONFIG.API_ENDPOINTS.agendamentos);
}

/**
 * Get all WhatsApp data
 * Note: n8n flow doesn't expose WhatsApp data endpoint yet
 */
export async function getWhatsApp() {
  // For now, fallback to CSV data since WhatsApp endpoint not exposed in n8n flow
  try {
    const { getWhatsApp: getWhatsAppCSV } = await import('./csvDataLoader.js');
    return getWhatsAppCSV();
  } catch (error) {
    console.warn('CSV fallback not available, returning empty array');
    return [];
  }
}

/**
 * Get stats for dashboard
 */
export async function getDashboardStats() {
  const [atendimentos, agendamentos, pedidos, whatsapp] = await Promise.all([
    getAtendimentos(),
    getAgendamentos(),
    getPedidos(),
    getWhatsApp(),
  ]);
  
  // Count today's items (mock - using items from today's date)
  const today = new Date().toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  const hoje = atendimentos.filter(a => a.Data === today).length;
  
  return {
    hoje,
    atendimentos: atendimentos.length,
    agendamentos: agendamentos.length,
    pedidos: pedidos.length,
    whatsapp: whatsapp.length,
  };
}

