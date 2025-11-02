export const toEndOfVietnameseDay = (date: Date) => {
  const viOffsetMs = 7 * 60 * 60 * 1000;
  const vi = new Date(date.getTime() + viOffsetMs);
  const year = vi.getUTCFullYear();
  const month = vi.getUTCMonth();
  const day = vi.getUTCDate();
  return new Date(Date.UTC(year, month, day, 16, 59, 59, 999) - viOffsetMs);
};
