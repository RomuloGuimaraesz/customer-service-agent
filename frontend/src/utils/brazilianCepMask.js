/**
 * Máscara de CEP no padrão brasileiro: XXXXX-XXX
 * Aceita até 8 dígitos. Zeros à esquerda são preservados como string.
 */

const CEP_MAX_DIGITS = 8;

/** Remove tudo que não for dígito e limita ao tamanho de CEP BR. */
export function extractBrazilianCepDigits(value, maxLength = CEP_MAX_DIGITS) {
  return String(value ?? '')
    .replace(/\D/g, '')
    .slice(0, maxLength);
}

/**
 * Recupera zero à esquerda quando o CEP veio com 7 dígitos (ex.: planilha numérica).
 * Não altera entradas parciais que já começam com zero.
 */
export function normalizeBrazilianCepDigits(value) {
  const digits = extractBrazilianCepDigits(value);
  if (!digits) return '';
  if (digits.length >= CEP_MAX_DIGITS) {
    return digits.slice(0, CEP_MAX_DIGITS);
  }
  if (digits.length === CEP_MAX_DIGITS - 1 && digits[0] !== '0') {
    return digits.padStart(CEP_MAX_DIGITS, '0');
  }
  return digits;
}

function formatDigitsAsCep(digits) {
  if (!digits) return '';
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/**
 * Formata dígitos para exibição: 09910-100
 * @param {string} value — dígitos ou texto com formatação
 */
export function formatBrazilianCep(value) {
  return formatDigitsAsCep(extractBrazilianCepDigits(value));
}

/**
 * Formata CEP para envio ao n8n, preservando zero à esquerda quando aplicável.
 */
export function formatBrazilianCepForPayload(value) {
  return formatDigitsAsCep(normalizeBrazilianCepDigits(value));
}
