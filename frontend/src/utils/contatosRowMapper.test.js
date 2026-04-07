import { describe, expect, it } from 'vitest';
import { buildFlatContatoPayload } from './contatosRowMapper.js';

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
