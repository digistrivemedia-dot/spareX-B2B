"use client";

import { ClipboardCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/ui/SubmitButton";
import { finishWorkAction } from "@/features/job-cards/actions";

/** Hands the vehicle over for its quality check once everything is ticked off. */
export function FinishWorkButton({ jobId, openCount }: { jobId: string; openCount: number }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  async function finish() {
    setIsSaving(true);
    const result = await finishWorkAction(jobId);
    setIsSaving(false);
    if (!result.ok) return toast.error(result.message);
    toast.success("Sent for quality check");
    router.push("/garage/my-jobs");
  }

  return (
    <div className="flex flex-col gap-1">
      <SubmitButton
        type="button"
        size="lg"
        isPending={isSaving}
        onClick={finish}
        disabled={openCount > 0}
        className="w-full"
      >
        <ClipboardCheck aria-hidden />
        Work done: send for quality check
      </SubmitButton>
      {openCount > 0 && (
        <p className="text-center text-xs text-gray-500">{openCount} still to tick off</p>
      )}
    </div>
  );
}
