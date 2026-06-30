import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  fetchAddressByCep,
  mapViaCepResponseToContatoFields,
} from './viacepService.js';

describe('mapViaCepResponseToContatoFields', () => {
  it('maps a valid ViaCEP payload to contato fields', () => {
    expect(
      mapViaCepResponseToContatoFields({
        cep: '01001-000',
        logradouro: 'Praça da Sé',
        complemento: 'lado ímpar',
        bairro: 'Sé',
        localidade: 'São Paulo',
        uf: 'SP',
      }),
    ).toEqual({
      endereco: 'Praça da Sé',
      bairro: 'Sé',
      bairroComplemento: 'lado ímpar',
      cidade: 'São Paulo',
      estado: 'SP',
    });
  });

  it('returns null when CEP is not found', () => {
    expect(mapViaCepResponseToContatoFields({ erro: true })).toBeNull();
    expect(mapViaCepResponseToContatoFields(null)).toBeNull();
  });
});

describe('fetchAddressByCep', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and maps address for a complete CEP', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        logradouro: 'Rua das Flores',
        complemento: '',
        bairro: 'Centro',
        localidade: 'Curitiba',
        uf: 'PR',
      }),
    });

    const result = await fetchAddressByCep('80010000');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://viacep.com.br/ws/80010000/json/',
      { signal: undefined },
    );
    expect(result).toEqual({
      endereco: 'Rua das Flores',
      bairro: 'Centro',
      bairroComplemento: '',
      cidade: 'Curitiba',
      estado: 'PR',
    });
  });

  it('returns null without calling the API when CEP is incomplete', async () => {
    global.fetch = vi.fn();

    await expect(fetchAddressByCep('80010')).resolves.toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('throws when ViaCEP responds with HTTP error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
    });

    await expect(fetchAddressByCep('99999999')).rejects.toThrow(
      'ViaCEP retornou status 400',
    );
  });
});
