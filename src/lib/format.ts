const LOCALE = "en-IN";
const TIME_ZONE = "Asia/Kolkata";

// Fixed list because ICU prints "Sept" for en-IN, and the house style is "12 Sep 2026".
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const rupees = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const rupeesWithPaise = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

const numbers = new Intl.NumberFormat(LOCALE);

const dateParts = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  timeZone: TIME_ZONE,
});

/** 12499900 → "₹1,24,999". Paise are shown only when the amount has them: 34560 → "₹345.60". */
export function formatPrice(paise: number): string {
  const formatter = paise % 100 === 0 ? rupees : rupeesWithPaise;
  return formatter.format(paise / 100);
}

/** 1240 → "1,240" */
export function formatNumber(value: number): string {
  return numbers.format(value);
}

/** ISO date string → "12 Oct 2026" (India time). */
export function formatDate(iso: string): string {
  const parts = dateParts.formatToParts(new Date(iso));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${part("day")} ${MONTHS[Number(part("month")) - 1]} ${part("year")}`;
}

const timeOfDay = new Intl.DateTimeFormat(LOCALE, {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: TIME_ZONE,
});

/** ISO date string → "3:45 pm" (India time). */
export function formatTimeOfDay(iso: string): string {
  return timeOfDay.format(new Date(iso)).toLowerCase();
}

/** ISO date string → "12 Oct 2026, 3:45 pm" (India time). */
export function formatDateTime(iso: string): string {
  return `${formatDate(iso)}, ${formatTimeOfDay(iso)}`;
}

/** "+919845012345" → "+91 98450 12345" */
export function formatPhone(e164: string): string {
  const digits = e164.replace(/\D/g, "").slice(-10);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

const relativeTime = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

/** ISO date string → "2 hours ago", "yesterday"; a full date once it is over a week old. */
export function formatRelativeTime(iso: string): string {
  const elapsed = new Date(iso).getTime() - Date.now();
  if (Math.abs(elapsed) > 7 * RELATIVE_UNITS[0][1]) return formatDate(iso);
  for (const [unit, ms] of RELATIVE_UNITS) {
    if (Math.abs(elapsed) >= ms) return relativeTime.format(Math.round(elapsed / ms), unit);
  }
  return "just now";
}

/** 12, "bottle" → "12 bottles"; 1, "invoice" → "1 invoice" */
export function formatCount(count: number, noun: string): string {
  return `${formatNumber(count)} ${count === 1 ? noun : `${noun}s`}`;
}
