export function getDaysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getEndOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function formatIsoDateTime(
  isoString: string | Date,
  options: { date: boolean; time: boolean } = { date: true, time: true }
): string {
  const date = new Date(isoString).toLocaleString("vi-VI", {
    ...(options.date
      ? { year: "numeric", month: "2-digit", day: "2-digit" }
      : {}),
    ...(options.time
      ? {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      : {}),
  });
  return date;
}

export function getDateBeforeDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
}
