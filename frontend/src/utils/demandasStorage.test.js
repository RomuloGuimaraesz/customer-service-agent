import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEMANDAS_STORAGE_KEY,
  createDemandaId,
  formatTempoDecorrido,
  isDraftEmpty,
  loadDemandas,
  readJSON,
  removeKey,
  writeJSON,
} from './demandasStorage.js';
import { DEMANDA_STATUS, DIADEMA_BAIRROS } from '../data/demandasSeed.js';

const DAY_MS = 24 * 60 * 60 * 1000;

describe('loadDemandas', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('seeds 12 synthetic demandas on first visit and persists them', () => {
    const demandas = loadDemandas();
    expect(demandas).toHaveLength(12);
    expect(readJSON(DEMANDAS_STORAGE_KEY)).toEqual(demandas);

    const statuses = new Set(demandas.map(d => d.status));
    expect(statuses).toEqual(new Set(Object.values(DEMANDA_STATUS)));
    demandas.forEach(d => {
      expect(DIADEMA_BAIRROS).toContain(d.bairro);
      const dias = (Date.now() - new Date(d.criadaEm).getTime()) / DAY_MS;
      expect(dias).toBeGreaterThanOrEqual(1 - 0.01);
      expect(dias).toBeLessThanOrEqual(20 + 0.01);
    });
  });

  it('does not overwrite existing data', () => {
    const existing = [{ id: 'x', nome: 'Teste', bairro: 'Centro' }];
    writeJSON(DEMANDAS_STORAGE_KEY, existing);
    expect(loadDemandas()).toEqual(existing);
  });

  it('keeps working in memory when localStorage throws', () => {
    const getItem = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('blocked');
      });
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('blocked');
      });
    const removeItem = vi
      .spyOn(Storage.prototype, 'removeItem')
      .mockImplementation(() => {
        throw new Error('blocked');
      });

    expect(loadDemandas()).toHaveLength(12);
    expect(writeJSON('k', 1)).toBe(false);
    expect(readJSON('k', 'fallback')).toBe('fallback');
    expect(() => removeKey('k')).not.toThrow();

    getItem.mockRestore();
    setItem.mockRestore();
    removeItem.mockRestore();
  });
});

describe('createDemandaId', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('falls back when crypto.randomUUID is unavailable', () => {
    vi.stubGlobal('crypto', {});
    const a = createDemandaId();
    const b = createDemandaId();
    expect(a).toMatch(/^demanda-/);
    expect(a).not.toBe(b);
  });
});

describe('formatTempoDecorrido', () => {
  const now = new Date('2026-11-08T12:00:00Z').getTime();

  it('formats days ago in pt-BR', () => {
    expect(formatTempoDecorrido(new Date(now - 3 * DAY_MS).toISOString(), now)).toBe('há 3 dias');
    expect(formatTempoDecorrido(new Date(now - 1 * DAY_MS).toISOString(), now)).toBe('há 1 dia');
  });

  it('handles very recent items', () => {
    expect(formatTempoDecorrido(new Date(now).toISOString(), now)).toBe('agora mesmo');
  });
});

describe('isDraftEmpty', () => {
  it('treats blank strings and null as empty', () => {
    expect(isDraftEmpty(null)).toBe(true);
    expect(isDraftEmpty({ nome: '  ', bairro: '', categoria: null })).toBe(true);
  });

  it('detects any filled field', () => {
    expect(isDraftEmpty({ nome: '', categoria: 'Saúde' })).toBe(false);
    expect(isDraftEmpty({ nome: 'Ana', bairro: '' })).toBe(false);
  });
});
