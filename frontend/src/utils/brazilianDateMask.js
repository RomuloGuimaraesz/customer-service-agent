/**
 * Máscara de data no padrão brasileiro: dd/mm/aaaa
 * Aceita até 8 dígitos (dd + mm + aaaa).
 */

const DATE_MAX_DIGITS = 8;

/** Remove tudo que não for dígito e limita ao tamanho de data BR. */
export function extractBrazilianDateDigits(value, maxLength = DATE_MAX_DIGITS) {
  return String(value ?? '')
    .replace(/\D/g, '')
    .slice(0, maxLength);
}

/**
 * Formata dígitos para exibição: 31/12/1990
 * @param {string} value — dígitos ou texto com formatação
 */
export function formatBrazilianDate(value) {
  const digits = extractBrazilianDateDigits(value);
  if (!digits) return '';

  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/**
 * Data de hoje (ou referência) no formato dd/mm/aaaa para payloads da planilha.
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
export function formatTodayBrazilianDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
