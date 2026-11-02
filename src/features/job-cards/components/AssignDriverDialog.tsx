"use client";

import { Truck } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { assignDriverAction, getBranchStaffAction } from "@/features/job-cards/actions";
import type { DriverLoad } from "@/features/job-cards/api";
import type { JobCard } from "@/features/job-cards/types";
import { formatCount } from "@/lib/format";

type AssignDriverDialogProps = {
  job: Pick<JobCard, "id" | "branch" | "pickupDrop">;
  trip: "pickup" | "drop";
  label: string;
};

/** Send any staff member at the branch to fetch the vehicle or take it back. */
export function AssignDriverDialog({ job, trip, label }: AssignDriverDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [staff, setStaff] = useState<DriverLoad[] | null>(null);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const address = trip === "pickup" ? job.pickupDrop?.pickupAddress : job.pickupDrop?.dropAddress;

  async function open(next: boolean) {
    setIsOpen(next);
    setError(undefined);
    if (!next) return;
    const result = await getBranchStaffAction(job.branch.id);
    if (result.ok) setStaff(result.data);
    else setError(result.message);
  }

  async function assign() {
    if (!selected) return setError("Choose who is driving.");
    setIsSaving(true);
    const result = await assignDriverAction(job.id, trip, selected);
    setIsSaving(false);
    if (!result.ok) return setError(result.message);
    setIsOpen(false);
    const name = staff?.find((person) => person.id === selected)?.name;
    toast.success(
      trip === "pickup" ? `${name} is going to pick it up` : `${name} is delivering it`,
      { description: "It's in their My trips list." },
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={open}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Truck aria-hidden />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {trip === "pickup" ? "Who's picking it up?" : "Who's delivering it?"}
          </DialogTitle>
          <DialogDescription>
            {trip === "pickup" ? "From" : "To"}: {address}
          </DialogDescription>
        </DialogHeader>
        <FormAlert message={error} />
        {staff === null ? (
          <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading staff">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : (
          <RadioGroup
            value={selected}
            onValueChange={setSelected}
            aria-label="Driver"
            className="flex flex-col gap-2"
          >
            {staff.map((person) => (
              <label
                key={person.id}
                htmlFor={`driver-${person.id}`}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 text-sm has-data-[state=checked]:border-navy-700 has-data-[state=checked]:bg-navy-50"
              >
                <RadioGroupItem id={`driver-${person.id}`} value={person.id} />
                <span className="flex-1 font-medium text-gray-900">{person.name}</span>
                <span className="text-gray-500">
                  {person.activeTrips ? `${formatCount(person.activeTrips, "trip")} now` : "Free"}
                </span>
              </label>
            ))}
          </RadioGroup>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <SubmitButton type="button" isPending={isSaving} onClick={assign}>
            Send
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
