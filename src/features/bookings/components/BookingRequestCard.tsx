import Link from "next/link";

import { BookingCountdown } from "@/features/bookings/components/BookingCountdown";
import { BookingDecision } from "@/features/bookings/components/BookingDecision";
import { BookingSummary } from "@/features/bookings/components/BookingSummary";
import type { Booking } from "@/features/bookings/types";
import { formatWhen } from "@/lib/format";

type BookingRequestCardProps = {
  booking: Booking;
  /** Owners looking at every branch see which branch was booked. */
  showBranch: boolean;
};

/** A new request with its timer, answered right here without opening it. */
export function BookingRequestCard({ booking, showBranch }: BookingRequestCardProps) {
  return (
    <li className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <BookingCountdown respondBy={booking.respondBy} />
        <span className="text-sm font-semibold text-gray-900">
          {formatWhen(booking.slotAt)}
          {showBranch && (
            <span className="font-normal text-gray-500"> · {booking.branch.name}</span>
          )}
        </span>
      </div>
      <BookingSummary booking={booking} />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <Link
          href={`/garage/bookings/${booking.id}`}
          className="text-sm font-medium text-navy-700 hover:underline"
        >
          Details and past visits
        </Link>
        <BookingDecision booking={booking} />
      </div>
    </li>
  );
}
