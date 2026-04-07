import { CONFIG } from '../config/constants.js';
import { fetchApi } from './apiService.js';

/**
 * Normaliza uma linha do webhook para o formato usado na UI (mesmas chaves do mock).
 *
 * @param {Record<string, unknown>} item
 * @param {number} idx
 * @returns {Record<string, string>|null}
 */
function normalizeAtendimentoItem(item, idx) {
  if (!item || typeof item !== 'object') return null;
  const safe = key => item[key] ?? item[String(key).toLowerCase()];
  const id =
    safe('ID') ??
    safe('id') ??
    safe('row_number') ??
    safe('rowNumber') ??
    `atendimento-${idx}`;
  const nome = (safe('Nome') ?? safe('nome') ?? '').trim() || '—';
  const statusRaw = safe('Status') ?? safe('status');
  const status =
    statusRaw != null && String(statusRaw).trim() !== ''
      ? String(statusRaw).trim()
      : 'Sem status';

  return {
    ID: String(id),
    Status: status,
    Data: safe('Data') ?? safe('data') ?? '',
    Hora: safe('Hora') ?? safe('hora') ?? '',
    Nome: nome,
    WhatsApp: safe('WhatsApp') ?? safe('whatsapp') ?? '',
    Prioridade: safe('Prioridade') ?? safe('prioridade') ?? '',
    Assunto: safe('Assunto') ?? safe('assunto') ?? '',
    'Descricao Completa':
      safe('Descricao Completa') ??
      safe('Descrição Completa') ??
      safe('descricao completa') ??
      safe('descrição completa') ??
      '',
  };
}

/**
 * Lista atendimentos (GET webhook n8n).
 *
 * @param {string|null} authHeader
 * @returns {Promise<Array<Record<string, string>>>}
 */
export async function getAtendimentos(authHeader) {
  const response = await fetchApi(CONFIG.API_ENDPOINTS.atendimentos, {
    authHeader,
  });
  const list = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.items)
        ? response.items
        : Array.isArray(response?.results)
          ? response.results
          : [];

  return list
    .map((item, idx) => normalizeAtendimentoItem(item, idx))
    .filter(Boolean);
}
