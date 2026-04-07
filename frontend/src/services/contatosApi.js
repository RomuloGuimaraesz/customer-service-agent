import { CONFIG } from '../config/constants.js';
import { fetchApi } from './apiService.js';

/**
 * Lista contatos (GET no mesmo webhook n8n).
 *
 * @param {string|null} authHeader - Authorization (Basic), ou null
 * @returns {Promise<Array<Record<string, unknown>>>} Lista de linhas (chaves alinhadas à planilha / n8n)
 */
export function getContatos(authHeader) {
  return fetchApi(CONFIG.API_ENDPOINTS.contatos, {
    authHeader,
    method: 'GET',
  });
}

/**
 * Envia contato ao webhook n8n (admin-contatos).
 *
 * @param {Object} payload - Corpo JSON (ex.: modo, dadosPrincipais, informacoesAdicionais)
 * @param {string|null} authHeader - Authorization (Basic), ou null em modo demo
 * @returns {Promise<unknown>} Resposta parseada do servidor
 */
export function postContatos(payload, authHeader) {
  return fetchApi(CONFIG.API_ENDPOINTS.contatos, {
    authHeader,
    method: 'POST',
    body: payload,
  });
}
