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
 * Compat endpoint legado (POST em admin-contatos).
 *
 * @param {Object} payload - Corpo JSON
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

/**
 * Atualiza contato existente (modo Todos) — webhook admin-contatos-put.
 *
 * @param {Object} payload - Corpo JSON (ex.: modo, dadosPrincipais, informacoesAdicionais)
 * @param {string|null} authHeader - Authorization (Basic), ou null em modo demo
 * @returns {Promise<unknown>} Resposta parseada do servidor
 */
export function putContatos(payload, authHeader) {
  return fetchApi(CONFIG.API_ENDPOINTS.contatosPut, {
    authHeader,
    method: 'PUT',
    body: payload,
  });
}

/**
 * Remove contato — webhook admin-contatos-delete.
 *
 * @param {Object} payload - Corpo JSON com chave de identificação (ex.: `{ WhatsApp }`)
 * @param {string|null} authHeader
 * @returns {Promise<unknown>}
 */
export function deleteContato(payload, authHeader) {
  return fetchApi(CONFIG.API_ENDPOINTS.contatosDelete, {
    authHeader,
    method: 'DELETE',
    body: payload,
  });
}

/**
 * Cria novo contato (modo Novo) — webhook admin-contatos-post, corpo plano com chaves da planilha.
 *
 * @param {Record<string, string>} body - Ex.: `{ Nome, WhatsApp, ... }`
 * @param {string|null} authHeader
 * @returns {Promise<unknown>}
 */
export function postNovoContato(body, authHeader) {
  return fetchApi(CONFIG.API_ENDPOINTS.contatosPost, {
    authHeader,
    method: 'POST',
    body,
  });
}
