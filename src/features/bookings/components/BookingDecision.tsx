"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ReasonDialog } from "@/components/ui/ReasonDialog";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { acceptBookingAction, declineBookingAction } from "@/features/bookings/actions";
import type { Booking } from "@/features/bookings/types";
import { cn } from "@/lib/utils";

type BookingDecisionProps = {
  booking: Booking;
  /** Called once the request is answered, e.g. to close the new-booking alert. */
  onAnswered?: () => void;
  className?: string;
};

/**
 * Accept (which opens a job card) or decline with a reason; there is no reschedule. Accepting
 * needs no confirmation: it isn't destructive, and requests are answered against the clock.
 */
export function BookingDecision({ booking, onAnswered, className }: BookingDecisionProps) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);

  async function accept() {
    setIsAccepting(true);
    const result = await acceptBookingAction(booking.id);
    setIsAccepting(false);
    if (!result.ok) return toast.error(result.message);
    const { jobId, jobNumber } = result.data;
    toast.success(`Accepted. Job card ${jobNumber} opened.`, {
      description: "The customer has been told. Check the vehicle in when it arrives.",
      action: { label: "Open job card", onClick: () => router.push(`/garage/jobs/${jobId}`) },
    });
    onAnswered?.();
    router.refresh();
  }

  async function decline(reason: string) {
    const result = await declineBookingAction(booking.id, reason);
    if (result.ok) {
      onAnswered?.();
      router.refresh();
    }
    return result;
  }

  return (
    <div className={cn("flex flex-wrap items-center justify-end gap-2", className)}>
      <ReasonDialog
        trigger={
          <Button variant="outline">
            <X aria-hidden />
            Decline
          </Button>
        }
        title="Decline this booking?"
        description="The customer sees your reason in the app and can book another garage or time."
        label="Reason"
        placeholder="e.g. Fully booked that day. Please try Thursday."
        confirmLabel="Decline booking"
        successMessage="Booking declined. The customer has been told."
        onConfirm={decline}
        isDestructive
      />
      <SubmitButton type="button" isPending={isAccepting} onClick={accept}>
        <Check aria-hidden />
        Accept
      </SubmitButton>
    </div>
  );
}
