import type { Booking } from "@/features/bookings/types";

/** The last minutes get the danger colour, so a request about to be missed stands out. */
export const URGENT_MS = 3 * 60_000;

/** Time left on a request, as "4:32". */
export function formatTimeLeft(ms: number): string {
  const seconds = Math.floor((ms % 60_000) / 1000);
  return `${Math.floor(ms / 60_000)}:${String(seconds).padStart(2, "0")}`;
}

/** Stands for "the reason is typed in" in the decline dialog; customers never see it. */
export const OTHER_REASON = "Other";

/** One-tap reasons, in words a customer can read, since they see the one chosen. */
export function getDeclineReasons(booking: Pick<Booking, "pickupDrop">): string[] {
  return [
    "Fully booked that day",
    "This time isn't available",
    "We don't offer this service",
    ...(booking.pickupDrop ? ["Too far for pick-up"] : []),
    OTHER_REASON,
  ];
}
