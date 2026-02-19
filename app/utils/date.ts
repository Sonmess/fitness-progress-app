/**
 * Formats date to short format: DD.MM.YY
 * @param date Date to format
 * @returns Formatted date string (e.g., "09.02.26")
 */
export function formatDateShort(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = (date.getFullYear() % 100).toString().padStart(2, '0');
    return `${day}.${month}.${year}`;
}

/**
 * Formats date to long format: Month Day, Year
 * @param date Date to format
 * @returns Formatted date string (e.g., "Feb 9, 2026")
 */
export function formatDateLong(date: Date): string {
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}