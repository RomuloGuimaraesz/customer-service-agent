/**
 * Máscara de telefone celular no padrão brasileiro: (XX) 9XXXX-XXXX
 * Aceita até 11 dígitos (DDD + número com 9).
 */

const MOBILE_MAX_DIGITS = 11;

/** Remove tudo que não for dígito e limita ao tamanho de celular BR. */
export function extractBrazilianMobileDigits(value, maxLength = MOBILE_MAX_DIGITS) {
  return String(value ?? '')
    .replace(/\D/g, '')
    .slice(0, maxLength);
}

/**
 * Formata dígitos para exibição: (11) 98765-4321
 * @param {string} value — dígitos ou texto com formatação
 */
export function formatBrazilianMobilePhone(value) {
  const digits = extractBrazilianMobileDigits(value);
  if (!digits) return '';

  if (digits.length <= 2) {
    return `(${digits}`;
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
