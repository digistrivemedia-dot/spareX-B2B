import Link from "next/link";

import { NumberPlate } from "@/components/ui/NumberPlate";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Booking } from "@/features/bookings/types";
import { toIndiaDate } from "@/lib/dates";
import { formatDayLabel, formatTimeOfDay } from "@/lib/format";

type BookingListProps = {
  bookings: Booking[];
  showBranch: boolean;
};

/** Accepted, declined and missed bookings by day: when, which vehicle, and what came of it. */
export function BookingList({ bookings, showBranch }: BookingListProps) {
  const days = Map.groupBy(bookings, (booking) => toIndiaDate(booking.slotAt));

  return (
    <div className="flex flex-col gap-6">
      {[...days.values()].map((day) => (
        <section key={day[0].slotAt} aria-label={formatDayLabel(day[0].slotAt)}>
          <h2 className="mb-2 text-sm font-semibold text-gray-500">
            {formatDayLabel(day[0].slotAt)}
          </h2>
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {day.map((booking) => (
              <BookingListRow key={booking.id} booking={booking} showBranch={showBranch} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function BookingListRow({ booking, showBranch }: { booking: Booking; showBranch: boolean }) {
  return (
    <li className="relative flex flex-col gap-2 px-4 py-3 hover:bg-gray-50 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-20 shrink-0 text-sm font-semibold text-gray-900 tabular-nums">
        {formatTimeOfDay(booking.slotAt)}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2">
          <NumberPlate plate={booking.vehicle.plate} />
          {/* The row opens the booking; the job card link sits above this one. */}
          <Link
            href={`/garage/bookings/${booking.id}`}
            className="text-sm font-semibold text-gray-900 after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {booking.vehicle.make} {booking.vehicle.model}
          </Link>
        </span>
        <span className="truncate text-sm text-gray-500">
          {booking.customer.name}
          {booking.pickupDrop && " · Pick-up & drop"}
          {showBranch && ` · ${booking.branch.name}`}
          {booking.declineReason && ` · “${booking.declineReason}”`}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-3">
        {booking.status !== "accepted" && <StatusBadge status={booking.status} />}
        {booking.jobId && booking.jobNumber && (
          <Link
            href={`/garage/jobs/${booking.jobId}`}
            className="relative z-10 text-sm font-medium text-navy-700 hover:underline"
          >
            Job card {booking.jobNumber} →
          </Link>
        )}
      </span>
    </li>
  );
}
