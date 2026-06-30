import { describe, expect, it } from 'vitest';
import {
  extractBrazilianMobileDigits,
  formatBrazilianMobilePhone,
} from './brazilianPhoneMask.js';

describe('extractBrazilianMobileDigits', () => {
  it('keeps only digits up to 11 characters', () => {
    expect(extractBrazilianMobileDigits('(11) 98765-4321')).toBe('11987654321');
    expect(extractBrazilianMobileDigits('11987654321999')).toBe('11987654321');
  });

  it('returns empty string for blank input', () => {
    expect(extractBrazilianMobileDigits('')).toBe('');
    expect(extractBrazilianMobileDigits(null)).toBe('');
  });
});

describe('formatBrazilianMobilePhone', () => {
  it('formats partial input while typing', () => {
    expect(formatBrazilianMobilePhone('1')).toBe('(1');
    expect(formatBrazilianMobilePhone('11')).toBe('(11');
    expect(formatBrazilianMobilePhone('119')).toBe('(11) 9');
    expect(formatBrazilianMobilePhone('1198765')).toBe('(11) 98765');
  });

  it('formats a complete mobile number', () => {
    expect(formatBrazilianMobilePhone('11987654321')).toBe('(11) 98765-4321');
    expect(formatBrazilianMobilePhone('(11) 98765-4321')).toBe('(11) 98765-4321');
  });
});
