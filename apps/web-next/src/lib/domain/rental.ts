/**
 * Calculate end date string (YYYY-MM-DD)
 */
export function calculateEndDate(startDate: string, duration: number): string {
  if (!startDate) return "";
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + duration);
  return end.toISOString().split("T")[0];
}

/**
 * Calculate delivery estimate text
 */
export function calculateDeliveryEstimate(
  startDate: string | null,
  cutoffHour: number,
): string {
  if (!startDate) {
    return "Pilih tanggal untuk estimasi pengantaran";
  }

  const now = new Date();
  // Parse YYYY-MM-DD as local midnight (new Date("YYYY-MM-DD") is UTC, which breaks timezone comparison)
  const [year, month, day] = startDate.split("-").map(Number);
  const start = new Date(year, month - 1, day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isToday = start.getTime() === today.getTime();

  if (isToday) {
    const currentHour = now.getHours();
    if (currentHour < cutoffHour) {
      return "Bisa antar hari ini! 🚚";
    } else {
      return "Antar besok pagi";
    }
  } else {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "short",
    };
    const dateStr = start.toLocaleDateString("id-ID", options);
    return `Antar ${dateStr}`;
  }
}

