"use client";

import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getNewBookingRequestsAction } from "@/features/bookings/actions";
import type { Booking } from "@/features/bookings/types";
import { formatTimeLeft, URGENT_MS } from "@/features/bookings/utils";
import { formatCount } from "@/lib/format";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

/** How often to look for new requests. A real backend can push them instead. */
const CHECK_EVERY_MS = 20_000;

/**
 * New requests and the soonest deadline, in the top bar, so they aren't missed from other pages
 * without interrupting the work there. The dashboard and Bookings show the requests themselves.
 */
export function NewBookingsIndicator() {
  const pathname = usePathname();
  const now = useNow();
  const [requests, setRequests] = useState<Booking[]>([]);

  useEffect(() => {
    let isActive = true;
    async function check() {
      const result = await getNewBookingRequestsAction();
      if (isActive && result.ok) setRequests(result.data);
    }
    void check();
    const timer = setInterval(check, CHECK_EVERY_MS);
    return () => {
      isActive = false;
      clearInterval(timer);
    };
  }, [pathname]);

  if (now === null || pathname === "/garage" || pathname.startsWith("/garage/bookings")) {
    return null;
  }
  const waiting = requests.filter((request) => Date.parse(request.respondBy) > now);
  if (waiting.length === 0) return null;
  const left = Math.min(...waiting.map((request) => Date.parse(request.respondBy))) - now;

  return (
    <Link
      href="/garage/bookings"
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold whitespace-nowrap tabular-nums focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        left <= URGENT_MS ? "bg-danger-50 text-danger-700" : "bg-warning-50 text-warning-700",
      )}
    >
      <CalendarClock aria-hidden className="size-4" />
      <span className="hidden xl:inline">{formatCount(waiting.length, "new booking")} ·</span>
      <span className="xl:hidden">{waiting.length} ·</span>
      <span>{formatTimeLeft(left)} left</span>
    </Link>
  );
}
