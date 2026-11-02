"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { useBranches } from "@/features/company/components/BranchesProvider";
import { useSelectedBranch } from "@/features/company/use-selected-branch";
import { setAcceptingBookingsAction } from "@/features/garage/actions";
import { cn } from "@/lib/utils";

/**
 * Turns new bookings on or off for a branch: staff for their own (`branchId`), owners for the
 * branch selected in the top bar. Requests already waiting stay in Bookings to be answered.
 */
export function BookingsSwitch({ branchId }: { branchId?: string }) {
  const branches = useBranches();
  const selected = useSelectedBranch();
  const branch = branchId ? branches.find((candidate) => candidate.id === branchId) : selected;
  const [isSaving, setIsSaving] = useState(false);

  if (!branch) return null;
  const { id, name, acceptingBookings } = branch;

  async function change(isAccepting: boolean) {
    setIsSaving(true);
    const result = await setAcceptingBookingsAction(id, isAccepting);
    setIsSaving(false);
    if (!result.ok) return toast.error(result.message);
    toast.success(
      isAccepting ? `${name} is accepting bookings` : `${name} has stopped accepting bookings`,
      {
        description: isAccepting
          ? "Customers can book this branch again."
          : "Requests already waiting are still in Bookings.",
      },
    );
  }

  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-2 px-1 text-sm font-medium">
      <span
        className={cn(
          "hidden whitespace-nowrap sm:inline",
          !acceptingBookings && "text-warning-700",
        )}
      >
        Bookings {acceptingBookings ? "on" : "off"}
      </span>
      <Switch
        checked={acceptingBookings}
        onCheckedChange={change}
        disabled={isSaving}
        aria-label={`Accepting bookings at ${name}`}
      />
    </label>
  );
}
