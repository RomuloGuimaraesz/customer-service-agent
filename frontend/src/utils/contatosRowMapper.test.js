import { describe, expect, it } from 'vitest';
import {
  buildContatoUpdatePayload,
  buildFlatContatoPayload,
  getContatoOriginalWhatsapp,
  getContatoRowNumber,
} from './contatosRowMapper.js';

describe('buildFlatContatoPayload', () => {
  it('maps form fields to spreadsheet keys (minimal create body)', () => {
    expect(
      buildFlatContatoPayload(
        { nome: 'João Teste', whatsapp: '11977776666' },
        {},
      ),
    ).toEqual({
      Nome: 'João Teste',
      WhatsApp: '11977776666',
    });
  });

  it('omits empty strings', () => {
    expect(buildFlatContatoPayload({ nome: '  ', whatsapp: '' }, {})).toEqual(
      {},
    );
  });
});

describe('getContatoRowNumber', () => {
  it('returns row_number as string when present', () => {
    expect(getContatoRowNumber({ row_number: 12 })).toBe('12');
    expect(getContatoRowNumber({ row_number: '7' })).toBe('7');
  });

  it('returns null when row_number is missing or blank', () => {
    expect(getContatoRowNumber({})).toBeNull();
    expect(getContatoRowNumber({ row_number: '  ' })).toBeNull();
  });
});

describe('getContatoOriginalWhatsapp', () => {
  it('reads WhatsApp from spreadsheet-style keys', () => {
    expect(getContatoOriginalWhatsapp({ WhatsApp: '11999998888' })).toBe(
      '11999998888',
    );
  });
});

describe('buildContatoUpdatePayload', () => {
  const selectedRow = {
    row_number: 5,
    WhatsApp: '11999998888',
    Nome: 'Maria Silva',
  };

  it('includes row_number and new WhatsApp when the number changes', () => {
    expect(
      buildContatoUpdatePayload(
        selectedRow,
        { nome: 'Maria Silva', whatsapp: '11988887777' },
        {},
      ),
    ).toEqual({
      Nome: 'Maria Silva',
      WhatsApp: '11988887777',
      row_number: '5',
    });
  });

  it('includes row_number when WhatsApp is unchanged', () => {
    expect(
      buildContatoUpdatePayload(
        selectedRow,
        { nome: 'Maria Atualizada', whatsapp: '11999998888' },
        { cpf: '12345678901' },
      ),
    ).toEqual({
      Nome: 'Maria Atualizada',
      WhatsApp: '11999998888',
      CPF: '12345678901',
      row_number: '5',
    });
  });

  it('does not overwrite WhatsApp with the original when row_number is present', () => {
    const payload = buildContatoUpdatePayload(
      selectedRow,
      { nome: 'Maria', whatsapp: '11000000000' },
      {},
    );
    expect(payload.WhatsApp).toBe('11000000000');
    expect(payload.WhatsApp).not.toBe('11999998888');
  });

  it('falls back to original WhatsApp for lookup when row_number is missing', () => {
    expect(
      buildContatoUpdatePayload(
        { WhatsApp: '11999998888', Nome: 'Legacy' },
        { nome: 'Legacy Atualizado', whatsapp: '11988887777' },
        {},
      ),
    ).toEqual({
      Nome: 'Legacy Atualizado',
      WhatsApp: '11999998888',
    });
  });

  it('uses original WhatsApp when row_number is missing and form WhatsApp is empty', () => {
    expect(
      buildContatoUpdatePayload(
        { WhatsApp: '11999998888' },
        { nome: 'Só Nome' },
        {},
      ),
    ).toEqual({
      Nome: 'Só Nome',
      WhatsApp: '11999998888',
    });
  });
});
