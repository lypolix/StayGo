/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Formats a date string from YYYY-MM-DD to dd.mm.yyyy
 * @param dateString Date string in YYYY-MM-DD format
 * @returns Formatted date string in dd.mm.yyyy format or empty string if input is invalid
 */
export const formatDateToDisplay = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}.${month}.${year}`;
};

/**
 * Parses a date string from dd.mm.yyyy to YYYY-MM-DD
 * @param displayDate Date string in dd.mm.yyyy format
 * @returns Date string in YYYY-MM-DD format or empty string if input is invalid
 */
export const parseDisplayDate = (displayDate: string): string => {
  if (!displayDate) return '';
  const [day, month, year] = displayDate.split('.');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * Formats a number of guests with correct Russian plural form
 * @param n Number of guests
 * @returns Formatted string with correct plural form (гость/гостя/гостей)
 */
export const pluralGuests = (n: number): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'гость';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'гостя';
  return 'гостей';
};
