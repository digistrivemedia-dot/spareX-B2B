"use client";

import { Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { formatTimeOfDay } from "@/lib/format";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

/** The last minutes get the danger colour, so a request about to be missed stands out. */
const URGENT_MS = 3 * 60_000;

/** Time left to answer a new booking request, ticking every second. */
export function BookingCountdown({ respondBy }: { respondBy: string }) {
  const router = useRouter();
  const now = useNow();
  const left = now === null ? null : Date.parse(respondBy) - now;
  const isOver = left !== null && left <= 0;

  // Once time is up the server marks the request missed; refresh to show it.
  useEffect(() => {
    if (isOver) router.refresh();
  }, [isOver, router]);

  const text =
    left === null
      ? `Respond by ${formatTimeOfDay(respondBy)}`
      : isOver
        ? "Time's up"
        : `${Math.floor(left / 60_000)}:${String(Math.floor((left % 60_000) / 1000)).padStart(2, "0")} left to respond`;

  return (
    <span
      role="timer"
      aria-live="off"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold tabular-nums",
        left !== null && left <= URGENT_MS
          ? "bg-danger-50 text-danger-700"
          : "bg-warning-50 text-warning-700",
      )}
    >
      <Timer aria-hidden className="size-4" />
      {text}
    </span>
  );
}
