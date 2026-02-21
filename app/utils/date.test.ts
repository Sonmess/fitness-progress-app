import { describe, it, expect } from 'vitest';
import { formatDateShort, formatDateLong } from './date';

describe('formatDateShort', () => {
  // Basic functionality
  it('should format a date in DD.MM.YY format', () => {
    const date = new Date('2026-02-09');
    expect(formatDateShort(date)).toBe('09.02.26');
  });

  // Zero padding tests
  it('should pad single-digit day with zero', () => {
    const date = new Date('2026-02-01');
    expect(formatDateShort(date)).toBe('01.02.26');
  });

  it('should pad single-digit month with zero', () => {
    const date = new Date('2026-01-15');
    expect(formatDateShort(date)).toBe('15.01.26');
  });

  it('should pad single-digit year with zero', () => {
    const date = new Date('2001-05-15');
    expect(formatDateShort(date)).toBe('15.05.01');
  });

  // Edge cases - months
  it('should format first month (January) correctly', () => {
    const date = new Date('2026-01-01');
    expect(formatDateShort(date)).toBe('01.01.26');
  });

  it('should format last month (December) correctly', () => {
    const date = new Date('2026-12-31');
    expect(formatDateShort(date)).toBe('31.12.26');
  });

  // Edge cases - days
  it('should format first day of month correctly', () => {
    const date = new Date('2026-06-01');
    expect(formatDateShort(date)).toBe('01.06.26');
  });

  it('should format last day of month correctly (31)', () => {
    const date = new Date('2026-07-31');
    expect(formatDateShort(date)).toBe('31.07.26');
  });

  it('should format last day of February correctly (28)', () => {
    const date = new Date('2025-02-28');
    expect(formatDateShort(date)).toBe('28.02.25');
  });

  it('should format last day of February in leap year (29)', () => {
    const date = new Date('2024-02-29');
    expect(formatDateShort(date)).toBe('29.02.24');
  });

  // Year edge cases
  it('should format year 2000 correctly', () => {
    const date = new Date('2000-06-15');
    expect(formatDateShort(date)).toBe('15.06.00');
  });

  it('should format year 2099 correctly', () => {
    const date = new Date('2099-12-31');
    expect(formatDateShort(date)).toBe('31.12.99');
  });

  it('should format year 2100 correctly (century change)', () => {
    const date = new Date('2100-01-01');
    expect(formatDateShort(date)).toBe('01.01.00');
  });

  // Historical dates
  it('should format dates from previous century', () => {
    const date = new Date('1999-12-31');
    expect(formatDateShort(date)).toBe('31.12.99');
  });

  it('should format dates from 1980s', () => {
    const date = new Date('1985-05-20');
    expect(formatDateShort(date)).toBe('20.05.85');
  });
});

describe('formatDateLong', () => {
  // Basic functionality
  it('should format a date in "Day Month Year" format', () => {
    const date = new Date('2026-02-09');
    expect(formatDateLong(date)).toBe('9 Feb 2026');
  });

  // Month names - test all 12 months
  it('should use abbreviated month names for all months', () => {
    const testCases = [
      { date: new Date('2026-01-15'), expected: '15 Jan 2026' },
      { date: new Date('2026-02-15'), expected: '15 Feb 2026' },
      { date: new Date('2026-03-15'), expected: '15 Mar 2026' },
      { date: new Date('2026-04-15'), expected: '15 Apr 2026' },
      { date: new Date('2026-05-15'), expected: '15 May 2026' },
      { date: new Date('2026-06-15'), expected: '15 Jun 2026' },
      { date: new Date('2026-07-15'), expected: '15 Jul 2026' },
      { date: new Date('2026-08-15'), expected: '15 Aug 2026' },
      { date: new Date('2026-09-15'), expected: '15 Sept 2026' },
      { date: new Date('2026-10-15'), expected: '15 Oct 2026' },
      { date: new Date('2026-11-15'), expected: '15 Nov 2026' },
      { date: new Date('2026-12-15'), expected: '15 Dec 2026' },
    ];

    testCases.forEach(({ date, expected }) => {
      expect(formatDateLong(date)).toBe(expected);
    });
  });

  // Day formatting (no padding in long format)
  it('should not pad single-digit days', () => {
    const date = new Date('2026-02-01');
    expect(formatDateLong(date)).toBe('1 Feb 2026');
  });

  it('should handle double-digit days', () => {
    const date = new Date('2026-02-28');
    expect(formatDateLong(date)).toBe('28 Feb 2026');
  });

  // Year formatting
  it('should display full 4-digit year', () => {
    const date1 = new Date('2026-06-15');
    expect(formatDateLong(date1)).toBe('15 Jun 2026');

    const date2 = new Date('2000-06-15');
    expect(formatDateLong(date2)).toBe('15 Jun 2000');
  });

  // Edge cases
  it('should format leap year date correctly', () => {
    const date = new Date('2024-02-29');
    expect(formatDateLong(date)).toBe('29 Feb 2024');
  });

  it('should format year boundaries correctly', () => {
    const newYear = new Date('2026-01-01');
    expect(formatDateLong(newYear)).toBe('1 Jan 2026');

    const endYear = new Date('2026-12-31');
    expect(formatDateLong(endYear)).toBe('31 Dec 2026');
  });

  // Historical dates
  it('should format dates from previous century', () => {
    const date = new Date('1999-05-15');
    expect(formatDateLong(date)).toBe('15 May 1999');
  });

  it('should format dates from 1900s correctly', () => {
    const date = new Date('1985-12-25');
    expect(formatDateLong(date)).toBe('25 Dec 1985');
  });

  // Century boundaries
  it('should handle century change correctly', () => {
    const date = new Date('2000-01-01');
    expect(formatDateLong(date)).toBe('1 Jan 2000');
  });
});