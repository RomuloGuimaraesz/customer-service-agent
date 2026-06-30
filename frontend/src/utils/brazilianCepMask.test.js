import { describe, expect, it } from 'vitest';
import {
  extractBrazilianCepDigits,
  formatBrazilianCep,
  formatBrazilianCepForPayload,
  normalizeBrazilianCepDigits,
} from './brazilianCepMask.js';

describe('extractBrazilianCepDigits', () => {
  it('keeps only digits up to 8 characters', () => {
    expect(extractBrazilianCepDigits('09910-100')).toBe('09910100');
    expect(extractBrazilianCepDigits('099101001234')).toBe('09910100');
  });

  it('preserves leading zeros', () => {
    expect(extractBrazilianCepDigits('09910100')).toBe('09910100');
  });

  it('returns empty string for blank input', () => {
    expect(extractBrazilianCepDigits('')).toBe('');
    expect(extractBrazilianCepDigits(null)).toBe('');
  });
});

describe('normalizeBrazilianCepDigits', () => {
  it('pads 7-digit CEP with leading zero', () => {
    expect(normalizeBrazilianCepDigits('9910100')).toBe('09910100');
  });

  it('does not pad partial CEP while typing', () => {
    expect(normalizeBrazilianCepDigits('09910')).toBe('09910');
    expect(normalizeBrazilianCepDigits('0991010')).toBe('0991010');
  });
});

describe('formatBrazilianCep', () => {
  it('formats partial input while typing', () => {
    expect(formatBrazilianCep('0')).toBe('0');
    expect(formatBrazilianCep('09910')).toBe('09910');
    expect(formatBrazilianCep('099101')).toBe('09910-1');
  });

  it('formats a complete CEP preserving leading zero', () => {
    expect(formatBrazilianCep('09910100')).toBe('09910-100');
    expect(formatBrazilianCep('09910-100')).toBe('09910-100');
  });

  it('recovers leading zero from 7-digit values', () => {
    expect(formatBrazilianCep('9910100')).toBe('99101-00');
    expect(formatBrazilianCepForPayload('9910100')).toBe('09910-100');
  });
});
