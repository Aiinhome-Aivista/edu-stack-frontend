import { formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Formats a date string into a relative time (e.g., "5 mins ago", "2 days ago").
 * Handles API date format: "2026-03-26 09:47:20"
 * @param {string} dateStr - Date string from API
 * @returns {string} Relative time string
 */
export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  try {
    // Replace space with T for ISO format if needed, but parseISO might handle it
    const cleanDateStr = dateStr.includes(' ') ? dateStr.replace(' ', 'T') : dateStr;
    const date = parseISO(cleanDateStr);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
}
