"use client";

import { BellRing } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getNewBookingRequestsAction } from "@/features/bookings/actions";
import { BookingCountdown } from "@/features/bookings/components/BookingCountdown";
import { BookingDecision } from "@/features/bookings/components/BookingDecision";
import { BookingSummary } from "@/features/bookings/components/BookingSummary";
import type { Booking } from "@/features/bookings/types";
import { formatWhen } from "@/lib/format";
import { useNow } from "@/lib/use-now";

/** How often to look for new requests. A real backend can push them instead. */
const CHECK_EVERY_MS = 20_000;

/**
 * Pops up a new booking request on any garage page, with its timer. It has to be answered:
 * it closes only on Accept or Decline, or when time runs out and the request is missed. The
 * Bookings page shows every request anyway, so the alert stays out of the way there.
 */
export function NewBookingAlert() {
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
  }, []);

  // A request whose time has run out is missed, so it no longer asks for an answer.
  const current =
    now === null ? undefined : requests.find((request) => Date.parse(request.respondBy) > now);
  const answered = (id: string) => setRequests((all) => all.filter((request) => request.id !== id));
  const isOpen = Boolean(current) && !pathname.startsWith("/garage/bookings");

  return (
    <Dialog open={isOpen}>
      {current && (
        <DialogContent
          role="alertdialog"
          showCloseButton={false}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BellRing aria-hidden className="size-5 text-orange-700" />
              New booking request
            </DialogTitle>
            <DialogDescription>
              {formatWhen(current.slotAt)} · {current.branch.name}
            </DialogDescription>
          </DialogHeader>
          <BookingCountdown respondBy={current.respondBy} />
          <BookingSummary booking={current} />
          <DialogFooter>
            <BookingDecision
              booking={current}
              onAnswered={() => answered(current.id)}
              className="w-full"
            />
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
