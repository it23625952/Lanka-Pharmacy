/**
 * Formats a Date object into a human-readable string.
 * Returns date in the format: "MMM DD, YYYY" (e.g., "Jan 15, 2024").
 * 
 * @param {Date} date - The Date object to format
 * @returns {string} Formatted date string
 * @throws {Error} If the input is not a valid Date object
 */
export function formatDate(date) {
    // Validate input is a Date object
    if (!(date instanceof Date) || isNaN(date)) {
        throw new Error('Invalid Date object provided to formatDate function');
    }
    
    return date.toLocaleDateString('en-US', {
        month: 'short',    // Abbreviated month name (e.g., Jan, Feb)
        day: 'numeric',    // Day of month (e.g., 1, 15, 31)
        year: 'numeric',   // Full year (e.g., 2024)
    });
}