/**
 * Formatting Utilities
 */

/**
 * Format a number as IDR currency
 * @param amount - The amount to format
 * @returns Formatted string (e.g. "1.500.000") - keeping the existing format which seems to just be the number part in some places,
 * but looking at code it uses `new Intl.NumberFormat("id-ID").format(amount)`
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID").format(amount);
}

/**
 * Format a date object
 * @param date - Date object or date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "short",
  }
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", options);
}
