"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/ui/SubmitButton";
import { acceptBookingAction } from "@/features/bookings/actions";
import { DeclineBookingDialog } from "@/features/bookings/components/DeclineBookingDialog";
import type { Booking } from "@/features/bookings/types";
import { cn } from "@/lib/utils";

type BookingDecisionProps = {
  booking: Booking;
  className?: string;
};

/**
 * Accept (which opens a job card) or decline with a reason; there is no reschedule. Accepting
 * needs no confirmation: it isn't destructive, and requests are answered against the clock.
 */
export function BookingDecision({ booking, className }: BookingDecisionProps) {
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
    router.refresh();
  }

  return (
    <div className={cn("flex flex-wrap items-center justify-end gap-2", className)}>
      <DeclineBookingDialog booking={booking} />
      <SubmitButton type="button" isPending={isAccepting} onClick={accept}>
        <Check aria-hidden />
        Accept
      </SubmitButton>
    </div>
  );
}
