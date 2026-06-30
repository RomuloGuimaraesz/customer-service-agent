import { describe, expect, it } from 'vitest';
import {
  extractBrazilianDateDigits,
  formatBrazilianDate,
  formatTodayBrazilianDate,
} from './brazilianDateMask.js';

describe('extractBrazilianDateDigits', () => {
  it('keeps only digits up to 8 characters', () => {
    expect(extractBrazilianDateDigits('31/12/1990')).toBe('31121990');
    expect(extractBrazilianDateDigits('311219901234')).toBe('31121990');
  });

  it('returns empty string for blank input', () => {
    expect(extractBrazilianDateDigits('')).toBe('');
    expect(extractBrazilianDateDigits(null)).toBe('');
  });
});

describe('formatBrazilianDate', () => {
  it('formats partial input while typing', () => {
    expect(formatBrazilianDate('3')).toBe('3');
    expect(formatBrazilianDate('31')).toBe('31');
    expect(formatBrazilianDate('311')).toBe('31/1');
    expect(formatBrazilianDate('3112')).toBe('31/12');
    expect(formatBrazilianDate('31121')).toBe('31/12/1');
  });

  it('formats a complete date', () => {
    expect(formatBrazilianDate('31121990')).toBe('31/12/1990');
    expect(formatBrazilianDate('31/12/1990')).toBe('31/12/1990');
  });
});

describe('formatTodayBrazilianDate', () => {
  it('formats a Date as dd/mm/aaaa', () => {
    expect(formatTodayBrazilianDate(new Date(2026, 5, 25))).toBe('25/06/2026');
  });
});
