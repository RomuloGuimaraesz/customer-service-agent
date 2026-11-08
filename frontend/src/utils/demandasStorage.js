/**
 * Persistência local do protótipo /demanda.
 * Todo acesso ao localStorage é protegido: com storage bloqueado (navegação
 * privada, política do navegador) a tela funciona normalmente, só sem persistir.
 */
import { buildDemandasSeed } from '../data/demandasSeed';

export const DEMANDAS_STORAGE_KEY = 'avecta.demandas.v1';
export const DEMANDAS_MODO_KEY = 'avecta.demandas.modo';
export const DEMANDAS_RASCUNHO_KEY = 'avecta.demandas.rascunho';

/** Acessar `window.localStorage` pode lançar SecurityError por si só. */
function getStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function readJSON(key, fallback = null) {
  try {
    const raw = getStorage()?.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** @returns {boolean} true se gravou */
export function writeJSON(key, value) {
  try {
    const storage = getStorage();
    if (!storage) return false;
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key) {
  try {
    getStorage()?.removeItem(key);
  } catch {
    // storage indisponível: nada a limpar
  }
}

/**
 * Lê as demandas; na primeira visita (chave ausente ou inválida) grava o seed.
 * Se o storage estiver bloqueado, devolve o seed só em memória.
 */
export function loadDemandas() {
  const stored = readJSON(DEMANDAS_STORAGE_KEY);
  if (Array.isArray(stored)) return stored;
  const seed = buildDemandasSeed();
  writeJSON(DEMANDAS_STORAGE_KEY, seed);
  return seed;
}

export function saveDemandas(demandas) {
  return writeJSON(DEMANDAS_STORAGE_KEY, demandas);
}

/** `crypto.randomUUID` só existe em contexto seguro (https ou localhost). */
export function createDemandaId() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // cai no fallback abaixo
  }
  return `demanda-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const relativeTimeFormat = new Intl.RelativeTimeFormat('pt-BR', {
  numeric: 'always',
});

/**
 * "há 3 dias", "há 2 horas", "agora mesmo".
 * @param {string} iso
 * @param {number} [now=Date.now()]
 */
export function formatTempoDecorrido(iso, now = Date.now()) {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return '';
  const diffMin = Math.max(0, Math.floor((now - time) / 60000));
  if (diffMin < 1) return 'agora mesmo';
  if (diffMin < 60) return relativeTimeFormat.format(-diffMin, 'minute');
  const diffHoras = Math.floor(diffMin / 60);
  if (diffHoras < 24) return relativeTimeFormat.format(-diffHoras, 'hour');
  return relativeTimeFormat.format(-Math.floor(diffHoras / 24), 'day');
}

/** Rascunho vazio = nenhum campo com conteúdo (texto em branco não conta). */
export function isDraftEmpty(draft) {
  if (!draft || typeof draft !== 'object') return true;
  return !Object.values(draft).some(v =>
    typeof v === 'string' ? v.trim() !== '' : v != null,
  );
}
