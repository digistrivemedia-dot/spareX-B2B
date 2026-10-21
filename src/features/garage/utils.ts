import type { GarageProfileValues } from "@/features/garage/schemas";
import type { DayHours, GarageProfile, Weekday } from "@/features/garage/types";

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

/** "09:00" → "9:00 am", "19:30" → "7:30 pm" */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours < 12 ? "am" : "pm";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** "Mon–Sat 9:00 am–7:30 pm · Sun 9:00 am–1:30 pm", grouping days in a row with the same hours. */
export function summariseHours(hours: DayHours[]): string {
  const slot = (day: DayHours) =>
    day.isOpen ? `${formatTime(day.opensAt)}–${formatTime(day.closesAt)}` : "Closed";
  const groups: { from: Weekday; to: Weekday; slot: string }[] = [];
  for (const day of hours) {
    const last = groups.at(-1);
    if (last && last.slot === slot(day)) last.to = day.day;
    else groups.push({ from: day.day, to: day.day, slot: slot(day) });
  }
  const short = (day: Weekday) => WEEKDAY_LABELS[day].slice(0, 3);
  return groups
    .map(
      (group) =>
        `${short(group.from)}${group.from === group.to ? "" : `–${short(group.to)}`} ${group.slot}`,
    )
    .join(" · ");
}

/** The editor's string fields from the saved profile. */
export function toProfileValues(profile: GarageProfile): GarageProfileValues {
  return {
    ...profile,
    services: profile.services.map((service) => ({
      id: service.id,
      name: service.name,
      price: String(service.priceInPaise / 100),
      duration: String(service.durationMinutes),
    })),
    dailyBookingLimit: String(profile.dailyBookingLimit),
  };
}

/** The saved profile from the editor's values. */
export function toGarageProfile(values: GarageProfileValues): GarageProfile {
  return {
    ...values,
    services: values.services.map((service) => ({
      id: service.id,
      name: service.name,
      priceInPaise: Math.round(Number(service.price) * 100),
      durationMinutes: Number(service.duration),
    })),
    dailyBookingLimit: Number(values.dailyBookingLimit),
    holidays: [...values.holidays].sort((a, b) => a.date.localeCompare(b.date)),
  };
}
