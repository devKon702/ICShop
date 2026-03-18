export function getDateAgo(value: `${number}${"d" | "m" | "y" | "w"}`): Date {
  const amount = parseInt(value.slice(0, -1), 10);
  const unit = value.slice(-1);
  const date = new Date();
  const day = date.getDate();

  switch (unit) {
    case "d":
      date.setDate(date.getDate() - amount);
      break;
    case "w":
      date.setDate(date.getDate() - amount * 7);
      break;
    case "m":
      date.setMonth(date.getMonth() - amount);
      // Handle month overflow -> e.g., March 31 - 1 month = February 28/29
      if (date.getDate() < day) {
        date.setDate(0);
      }
      break;
    case "y":
      // Handle year overflow -> e.g., February 29, 2020 - 1 year = February 28, 2019
      if (date.getDate() < day) {
        date.setDate(0);
      }
      date.setFullYear(date.getFullYear() - amount);
      break;
  }
  return date;
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
  options: { date: boolean; time: boolean } = { date: true, time: true },
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

export function formatTime(
  seconds: number,
  include?: { hours?: boolean; minutes?: boolean; seconds?: boolean },
): string {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const mins = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  let result = "";
  if (include?.hours ?? true) {
    result += `${hours}:`;
  }
  if (include?.minutes ?? true) {
    result += `${mins}:`;
  }
  if (include?.seconds ?? true) {
    result += `${secs}`;
  }
  return result;
}

export function formatTimeAgo(input: Date | string | number): string {
  const date = input instanceof Date ? input : new Date(input);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 5) return "vừa xong";
  if (diffSec < 60) return `${diffSec} giây trước`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} ngày trước`;

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 4) return `${diffWeek} tuần trước`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} tháng trước`;

  const diffYear = Math.floor(diffDay / 365);
  return `${diffYear} năm trước`;
}
