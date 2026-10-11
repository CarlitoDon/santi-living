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
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "short",
  },
): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", options);
}
