import type { Set } from '~/types';

/**
 * Calculates the maximum weight from an array of sets
 * @param sets Array of workout sets
 * @returns Maximum weight value, or 0 if no sets
 */
export function calculateMaxWeight(sets: Set[]): number {
    if (sets.length === 0) return 0;
    return Math.max(...sets.map(set => set.weight));
}

/**
 * Calculates total volume (reps × weight) from an array of sets
 * @param sets Array of workout sets
 * @returns Total volume as a number
 */
export function calculateVolume(sets: Set[]): number {
    return sets.reduce((total, set) => total + (set.reps * set.weight), 0);
}

/**
 * Calculates total volume and returns as formatted string
 * @param sets Array of workout sets
 * @returns Formatted volume string (e.g., "1520")
 */
export function calculateVolumeFormatted(sets: Set[]): string {
    return calculateVolume(sets).toFixed(0);
}

/**
 * Finds the set with the maximum weight
 * @param sets Array of workout sets
 * @returns The set with max weight, or null if no sets
 */
export function findBestSet(sets: Set[]): Set | null {
    if (sets.length === 0) return null;
    return sets.reduce((max, set) => {
        return set.weight > max.weight ? set : max;
    });
}

/**
 * Formats a set as "reps×weight" string
 * @param set Workout set
 * @returns Formatted string (e.g., "12×50")
 */
export function formatSet(set: Set): string {
    return `${set.reps}×${set.weight}`;
}

/**
 * Formats the best set from an array as "reps×weight" or "—" if empty
 * @param sets Array of workout sets
 * @returns Formatted best set string
 */
export function formatBestSet(sets: Set[]): string {
    const best = findBestSet(sets);
    return best ? formatSet(best) : '—';
}