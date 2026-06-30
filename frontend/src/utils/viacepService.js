const VIACEP_BASE_URL = 'https://viacep.com.br/ws';

/**
 * Mapeia a resposta do ViaCEP para os campos do formulário de contatos.
 * @param {Record<string, unknown>|null|undefined} data
 * @returns {Record<string, string>|null}
 */
export function mapViaCepResponseToContatoFields(data) {
  if (!data || data.erro === true || data.erro === 'true') {
    return null;
  }

  return {
    endereco: String(data.logradouro ?? '').trim(),
    bairro: String(data.bairro ?? '').trim(),
    bairroComplemento: String(data.complemento ?? '').trim(),
    cidade: String(data.localidade ?? '').trim(),
    estado: String(data.uf ?? '').trim(),
  };
}

/**
 * Consulta endereço pelo CEP (8 dígitos) na API ViaCEP.
 * @param {string} cepDigits — apenas dígitos
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<Record<string, string>|null>}
 */
export async function fetchAddressByCep(cepDigits, { signal } = {}) {
  const digits = String(cepDigits ?? '').replace(/\D/g, '');
  if (digits.length !== 8) {
    return null;
  }

  const response = await fetch(`${VIACEP_BASE_URL}/${digits}/json/`, { signal });
  if (!response.ok) {
    throw new Error(`ViaCEP retornou status ${response.status}`);
  }

  const data = await response.json();
  return mapViaCepResponseToContatoFields(data);
}
