"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormAlert } from "@/components/ui/FormAlert";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/textarea";
import { declineBookingAction } from "@/features/bookings/actions";
import type { Booking } from "@/features/bookings/types";
import { getDeclineReasons, OTHER_REASON } from "@/features/bookings/utils";

/** Decline with a reason in one tap; only "Other" asks for typing. The customer sees the reason. */
export function DeclineBookingDialog({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [choice, setChoice] = useState("");
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const isOther = choice === OTHER_REASON;

  async function decline() {
    const reason = isOther ? typed.trim() : choice;
    if (!choice) return setError("Choose a reason.");
    if (reason.length < 3) return setError("Tell the customer why.");
    setIsSaving(true);
    const result = await declineBookingAction(booking.id, reason);
    setIsSaving(false);
    if (!result.ok) return setError(result.message);
    setIsOpen(false);
    toast.success("Booking declined. The customer has been told.");
    router.refresh();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <X aria-hidden />
          Decline
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Decline this booking?</DialogTitle>
          <DialogDescription>
            The customer sees your reason in the app and can book another garage or time.
          </DialogDescription>
        </DialogHeader>
        <FormAlert message={error} />
        <RadioGroup
          value={choice}
          onValueChange={setChoice}
          aria-label="Reason"
          className="flex flex-col gap-2"
        >
          {getDeclineReasons(booking).map((reason) => (
            <label
              key={reason}
              htmlFor={`decline-${reason}`}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-900 has-data-[state=checked]:border-navy-700 has-data-[state=checked]:bg-navy-50"
            >
              <RadioGroupItem id={`decline-${reason}`} value={reason} />
              {reason}
            </label>
          ))}
        </RadioGroup>
        {isOther && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="decline-other">Your reason</Label>
            <Textarea
              id="decline-other"
              rows={2}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
            />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Keep booking
          </Button>
          <SubmitButton type="button" variant="destructive" isPending={isSaving} onClick={decline}>
            Decline booking
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
