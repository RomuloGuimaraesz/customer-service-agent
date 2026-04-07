import { describe, expect, it } from 'vitest';
import { normalizeCategoriasResponse } from './categoriasApi.js';

describe('normalizeCategoriasResponse', () => {
  it('maps admin-categorias spreadsheet rows (Categorias column)', () => {
    const raw = [
      { row_number: 2, Categorias: 'Amigo Luana' },
      { row_number: 5, Categorias: 'Cliente' },
    ];
    expect(normalizeCategoriasResponse(raw)).toEqual([
      { value: 'Amigo Luana', label: 'Amigo Luana' },
      { value: 'Cliente', label: 'Cliente' },
    ]);
  });
});
