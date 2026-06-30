import { describe, expect, it } from 'vitest';
import {
  buildContatoCreatePayload,
  buildContatoDeletePayload,
  buildContatoUpdatePayload,
  buildFlatContatoPayload,
  findContatosByNormalizedNome,
  getContatoOriginalWhatsapp,
  getContatoRowNumber,
  normalizeContatoNome,
} from './contatosRowMapper.js';

describe('normalizeContatoNome', () => {
  it('trims, collapses spaces and lowercases', () => {
    expect(normalizeContatoNome('  João   Silva  ')).toBe('joão silva');
  });

  it('returns empty string for blank input', () => {
    expect(normalizeContatoNome('   ')).toBe('');
    expect(normalizeContatoNome(null)).toBe('');
  });
});

describe('findContatosByNormalizedNome', () => {
  const lista = [
    { row_number: 1, Nome: 'João Silva' },
    { row_number: 2, Nome: 'Maria Costa' },
    { row_number: 3, Nome: 'JOÃO  silva' },
  ];

  it('finds matches case-insensitively with normalized spacing', () => {
    expect(findContatosByNormalizedNome(lista, 'joão silva')).toHaveLength(2);
    expect(findContatosByNormalizedNome(lista, '  João   Silva  ')).toHaveLength(
      2,
    );
  });

  it('returns empty array for blank nome', () => {
    expect(findContatosByNormalizedNome(lista, '  ')).toEqual([]);
  });

  it('returns empty array when no match', () => {
    expect(findContatosByNormalizedNome(lista, 'Pedro')).toEqual([]);
  });
});

describe('buildFlatContatoPayload', () => {
  it('maps form fields to spreadsheet keys (minimal create body)', () => {
    expect(
      buildFlatContatoPayload(
        { nome: 'João Teste', whatsapp: '11977776666' },
        {},
      ),
    ).toEqual({
      Nome: 'João Teste',
      WhatsApp: '(11) 97777-6666',
    });
  });

  it('formats WhatsApp even when form value is already masked', () => {
    expect(
      buildFlatContatoPayload(
        { nome: 'João Teste', whatsapp: '(11) 97777-6666' },
        {},
      ),
    ).toEqual({
      Nome: 'João Teste',
      WhatsApp: '(11) 97777-6666',
    });
  });

  it('formats data de nascimento for n8n', () => {
    expect(
      buildFlatContatoPayload(
        { nome: 'João Teste', dataNascimento: '15031990' },
        {},
      ),
    ).toEqual({
      Nome: 'João Teste',
      'Data de Nascimento': '15/03/1990',
    });
  });

  it('formats CEP for n8n preserving leading zero', () => {
    expect(
      buildFlatContatoPayload({ nome: 'João Teste', cep: '09910100' }, {}),
    ).toEqual({
      Nome: 'João Teste',
      CEP: '09910-100',
    });
  });

  it('recovers leading zero when CEP has 7 digits', () => {
    expect(
      buildFlatContatoPayload({ nome: 'João Teste', cep: '9910100' }, {}),
    ).toEqual({
      Nome: 'João Teste',
      CEP: '09910-100',
    });
  });

  it('omits empty strings', () => {
    expect(buildFlatContatoPayload({ nome: '  ', whatsapp: '' }, {})).toEqual(
      {},
    );
  });
});

describe('buildContatoCreatePayload', () => {
  const cadastroDate = new Date(2026, 5, 25);

  it('includes Responsável with the authenticated user email on create', () => {
    expect(
      buildContatoCreatePayload(
        { nome: 'João Teste', whatsapp: '11977776666' },
        {},
        'assessor@gabinete.gov.br',
        cadastroDate,
      ),
    ).toEqual({
      Nome: 'João Teste',
      WhatsApp: '(11) 97777-6666',
      Responsável: 'assessor@gabinete.gov.br',
      Data: '25/06/2026',
    });
  });

  it('omits Responsável when email is empty but still sets Data', () => {
    expect(
      buildContatoCreatePayload(
        { nome: 'João Teste' },
        {},
        '  ',
        cadastroDate,
      ),
    ).toEqual({
      Nome: 'João Teste',
      Data: '25/06/2026',
    });
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
      WhatsApp: '(11) 98888-7777',
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
      WhatsApp: '(11) 99999-8888',
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
    expect(payload.WhatsApp).toBe('(11) 00000-0000');
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

describe('buildContatoDeletePayload', () => {
  it('sends row_number when present (no WhatsApp required)', () => {
    expect(
      buildContatoDeletePayload({
        row_number: 8,
        Nome: 'Só Nome',
      }),
    ).toEqual({ row_number: '8' });
  });

  it('falls back to WhatsApp when row_number is missing', () => {
    expect(
      buildContatoDeletePayload({ WhatsApp: '11999998888', Nome: 'Legacy' }),
    ).toEqual({ WhatsApp: '11999998888' });
  });

  it('returns empty object when no identifier is available', () => {
    expect(buildContatoDeletePayload({ Nome: 'Sem chave' })).toEqual({});
  });
});
