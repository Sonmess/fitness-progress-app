import { describe, it, expect } from 'vitest';
import {
  calculateMaxWeight,
  calculateVolume,
  calculateVolumeFormatted,
  findBestSet,
  formatSet,
  formatBestSet,
} from './workout';
import type { Set } from '~/types';

describe('calculateMaxWeight', () => {
  it('should return the maximum weight from sets', () => {
    const sets: Set[] = [
      { reps: 12, weight: 50 },
      { reps: 10, weight: 52.5 },
      { reps: 8, weight: 47.5 },
    ];

    expect(calculateMaxWeight(sets)).toBe(52.5);
  });

  it('should return 0 for empty sets array', () => {
    expect(calculateMaxWeight([])).toBe(0);
  });

  it('should handle single set', () => {
    const sets: Set[] = [{ reps: 10, weight: 100 }];
    expect(calculateMaxWeight(sets)).toBe(100);
  });

  it('should handle decimal weights', () => {
    const sets: Set[] = [
      { reps: 10, weight: 50.25 },
      { reps: 10, weight: 50.75 },
    ];
    expect(calculateMaxWeight(sets)).toBe(50.75);
  });
});

describe('calculateVolume', () => {
  it('should calculate total volume correctly', () => {
    const sets: Set[] = [
      { reps: 10, weight: 50 },
      { reps: 8, weight: 50 },
    ];
    // (10 * 50) + (8 * 50) = 900
    expect(calculateVolume(sets)).toBe(900);
  });

  it('should return 0 for empty sets', () => {
    expect(calculateVolume([])).toBe(0);
  });

  it('should handle decimal weights', () => {
    const sets: Set[] = [
      { reps: 10, weight: 52.5 },
      { reps: 8, weight: 52.5 },
    ];
    // (10 * 52.5) + (8 * 52.5) = 945
    expect(calculateVolume(sets)).toBe(945);
  });

  it('should calculate complex workout volume', () => {
    const sets: Set[] = [
      { reps: 12, weight: 50 },
      { reps: 10, weight: 52.5 },
      { reps: 8, weight: 55 },
    ];
    // (12 * 50) + (10 * 52.5) + (8 * 55) = 600 + 525 + 440 = 1565
    expect(calculateVolume(sets)).toBe(1565);
  });
});

describe('calculateVolumeFormatted', () => {
  it('should return volume as formatted string without decimals', () => {
    const sets: Set[] = [
      { reps: 10, weight: 50 },
      { reps: 8, weight: 50 },
    ];
    expect(calculateVolumeFormatted(sets)).toBe('900');
  });

  it('should round decimal volumes to nearest integer', () => {
    const sets: Set[] = [
      { reps: 10, weight: 52.5 },
      { reps: 8, weight: 52.5 },
    ];
    expect(calculateVolumeFormatted(sets)).toBe('945');
  });

  it('should return "0" for empty sets', () => {
    expect(calculateVolumeFormatted([])).toBe('0');
  });
});

describe('findBestSet', () => {
  it('should return the set with maximum weight', () => {
    const sets: Set[] = [
      { reps: 12, weight: 50 },
      { reps: 10, weight: 52.5 },
      { reps: 8, weight: 47.5 },
    ];

    const best = findBestSet(sets);
    expect(best).toEqual({ reps: 10, weight: 52.5 });
  });

  it('should return null for empty sets', () => {
    expect(findBestSet([])).toBeNull();
  });

  it('should return the first set when all weights are equal', () => {
    const sets: Set[] = [
      { reps: 12, weight: 50 },
      { reps: 10, weight: 50 },
      { reps: 8, weight: 50 },
    ];

    const best = findBestSet(sets);
    expect(best).toEqual({ reps: 12, weight: 50 });
  });

  it('should handle single set', () => {
    const sets: Set[] = [{ reps: 10, weight: 100 }];
    const best = findBestSet(sets);
    expect(best).toEqual({ reps: 10, weight: 100 });
  });
});

describe('formatSet', () => {
  it('should format a set as "reps×weight"', () => {
    const set: Set = { reps: 12, weight: 50 };
    expect(formatSet(set)).toBe('12×50');
  });

  it('should handle decimal weights', () => {
    const set: Set = { reps: 10, weight: 52.5 };
    expect(formatSet(set)).toBe('10×52.5');
  });

  it('should handle zero values', () => {
    const set: Set = { reps: 0, weight: 0 };
    expect(formatSet(set)).toBe('0×0');
  });
});

describe('formatBestSet', () => {
  it('should format the best set from array', () => {
    const sets: Set[] = [
      { reps: 12, weight: 50 },
      { reps: 10, weight: 52.5 },
      { reps: 8, weight: 47.5 },
    ];

    expect(formatBestSet(sets)).toBe('10×52.5');
  });

  it('should return "—" for empty sets', () => {
    expect(formatBestSet([])).toBe('—');
  });

  it('should handle single set', () => {
    const sets: Set[] = [{ reps: 15, weight: 60 }];
    expect(formatBestSet(sets)).toBe('15×60');
  });
});
