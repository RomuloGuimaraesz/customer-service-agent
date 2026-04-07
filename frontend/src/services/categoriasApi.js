import { CONFIG } from '../config/constants.js';
import { fetchApi } from './apiService.js';

/**
 * Normaliza resposta do webhook (array, ou objeto com array aninhado).
 * Cada item pode ser string ou objeto com rótulo em `label` / `nome` / `Nome` e valor em `value` / `id` / `slug`.
 *
 * @param {unknown} data
 * @returns {{ value: string, label: string }[]}
 */
export function normalizeCategoriasResponse(data) {
  let rows = data;
  if (!rows) return [];
  if (!Array.isArray(rows)) {
    rows =
      rows.data ??
      rows.categorias ??
      rows.items ??
      (Array.isArray(rows.rows) ? rows.rows : null);
  }
  if (!Array.isArray(rows)) return [];

  return rows
    .map(row => {
      if (typeof row === 'string') {
        const v = row.trim();
        return v ? { value: v, label: v } : null;
      }
      if (row && typeof row === 'object') {
        const label =
          row.label ??
          row.name ??
          row.nome ??
          row.Nome ??
          row.Categorias ??
          row.categorias ??
          row.category ??
          row.Category ??
          row.titulo ??
          row['Nome da categoria'] ??
          row['Categorias'] ??
          '';
        let value =
          row.value ??
          row.slug ??
          row.codigo ??
          row.code ??
          row.id ??
          '';
        if (value === '' && label !== '') value = String(label);
        if (label === '' && value !== '') {
          return { value: String(value), label: String(value) };
        }
        if (value === '' && label === '') return null;
        return { value: String(value), label: String(label) };
      }
      return null;
    })
    .filter(Boolean)
    .filter((o, i, arr) => arr.findIndex(x => x.value === o.value) === i);
}

/**
 * Alinha valor salvo (planilha / contato) ao `value` de uma opção quando bate com o rótulo.
 *
 * @param {string} raw
 * @param {{ value: string, label: string }[]} options
 * @returns {string}
 */
export function resolveCategoriaOptionValue(raw, options) {
  const v = String(raw ?? '').trim();
  if (!v) return '';
  if (options.some(o => o.value === v)) return v;
  const byLabel = options.find(
    o => o.label.toLowerCase() === v.toLowerCase(),
  );
  if (byLabel) return byLabel.value;
  return v;
}

/**
 * Lista categorias (GET no webhook admin-categorias).
 *
 * @param {string|null} authHeader
 * @returns {Promise<{ value: string, label: string }[]>}
 */
export async function getCategorias(authHeader) {
  const data = await fetchApi(CONFIG.API_ENDPOINTS.categorias, {
    authHeader,
    method: 'GET',
  });
  return normalizeCategoriasResponse(data);
}
