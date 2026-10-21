"use client";

import { CircleCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ReasonDialog } from "@/components/ui/ReasonDialog";
import { acceptBookingAction, declineBookingAction } from "@/features/bookings/actions";
import type { Booking } from "@/features/bookings/types";
import { formatDateTime } from "@/lib/format";

/** Accept (which opens a job card) or decline with a reason. There is no reschedule. */
export function BookingDecision({ booking }: { booking: Booking }) {
  const router = useRouter();

  async function accept() {
    const result = await acceptBookingAction(booking.id);
    if (result.ok) router.push(`/garage/jobs/${result.data.jobId}`);
    return result;
  }

  return (
    <div className="flex flex-col gap-2">
      <ConfirmDialog
        trigger={
          <Button size="lg">
            <CircleCheck aria-hidden />
            Accept booking
          </Button>
        }
        title={`Accept ${booking.customer.name}'s booking?`}
        description={`We'll confirm ${formatDateTime(booking.slotAt)} at ${booking.branch.name} and open a job card for the vehicle.`}
        confirmLabel="Accept"
        successMessage="Booking accepted. The customer has been told."
        onConfirm={accept}
      />
      <ReasonDialog
        trigger={
          <Button variant="ghost" className="text-danger-700 hover:text-danger-700">
            <X aria-hidden />
            Decline
          </Button>
        }
        title="Decline this booking?"
        description="The customer sees your reason in the app and can book another garage or time."
        label="Reason"
        placeholder="e.g. Fully booked that day. Please try Thursday."
        confirmLabel="Decline booking"
        successMessage="Booking declined"
        onConfirm={(reason) => declineBookingAction(booking.id, reason)}
        isDestructive
      />
    </div>
  );
}
