"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ReasonDialog } from "@/components/ui/ReasonDialog";
import { respondToJobAction } from "@/features/job-cards/actions";

/** Accept a job assigned to you, or hand it back with a reason. */
export function MyJobResponse({ jobId }: { jobId: string }) {
  const [isAccepting, setIsAccepting] = useState(false);

  async function accept() {
    setIsAccepting(true);
    const result = await respondToJobAction(jobId, { accept: true });
    setIsAccepting(false);
    if (result.ok) toast.success("Job accepted. It's now in progress.");
    else toast.error(result.message);
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button size="lg" onClick={accept} disabled={isAccepting}>
        <Check aria-hidden />
        Accept
      </Button>
      <ReasonDialog
        trigger={
          <Button size="lg" variant="outline">
            Can&apos;t take it
          </Button>
        }
        title="Hand this job back?"
        description="Your manager sees the reason and assigns someone else."
        label="Reason"
        placeholder="e.g. On a clutch overhaul until 3 pm"
        confirmLabel="Hand back"
        successMessage="Job handed back"
        onConfirm={(reason) => respondToJobAction(jobId, { accept: false, reason })}
      />
    </div>
  );
}
