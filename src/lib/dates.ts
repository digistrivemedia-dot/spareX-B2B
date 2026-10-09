const indiaDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Midnight UTC of the India calendar day the moment falls on, so differences are whole days. */
function indiaDay(date: Date): number {
  return Date.parse(indiaDate.format(date));
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Calendar days from today (India time) to the date: 0 is today, 3 is three days ahead,
 * -9 is nine days ago. Used for "valid 5 more days" and "9 days overdue".
 */
export function daysFromToday(iso: string): number {
  return Math.round((indiaDay(new Date(iso)) - indiaDay(new Date())) / DAY_MS);
}

/** The India calendar day of a moment, as "YYYY-MM-DD" (the format of a date input). */
export function toIndiaDate(iso: string): string {
  return indiaDate.format(new Date(iso));
}
