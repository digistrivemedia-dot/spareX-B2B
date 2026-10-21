"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/FormAlert";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { recordApprovalAction } from "@/features/job-cards/actions";
import type { EstimateLine } from "@/features/job-cards/types";
import { sumLines } from "@/features/job-cards/utils";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const CHANNELS = ["In person", "By phone", "On WhatsApp", "In the SpareX app"];

type Decision = "approved" | "rejected";

/** The customer's answer, line by line, for everything waiting on them. */
export function ApprovalForm({ jobId, lines }: { jobId: string; lines: EstimateLine[] }) {
  const router = useRouter();
  const pending = lines.filter((line) => line.approval === "pending");
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [channel, setChannel] = useState(CHANNELS[1]);
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const approved = pending.filter((line) => decisions[line.id] === "approved");
  const allAnswered = pending.every((line) => decisions[line.id]);
  const isFirstEstimate = !lines.some((line) => line.approval === "approved");

  const decideAll = (decision: Decision) =>
    setDecisions(Object.fromEntries(pending.map((line) => [line.id, decision])));

  async function save() {
    if (!allAnswered) return setError("Record an answer for every line.");
    setIsSaving(true);
    const result = await recordApprovalAction(jobId, { decisions, note: channel });
    setIsSaving(false);
    if (!result.ok) return setError(result.message);
    toast.success(
      approved.length
        ? `${approved.length} of ${pending.length} approved`
        : isFirstEstimate
          ? "Estimate turned down. The job is closed with no fee."
          : "Extra work turned down. The original work carries on.",
    );
    router.push(`/garage/jobs/${jobId}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <FormAlert message={error} />
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => decideAll("approved")}>
          Approve all
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => decideAll("rejected")}>
          Turn down all
        </Button>
      </div>
      <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
        {pending.map((line) => (
          <li
            key={line.id}
            className="flex flex-wrap items-center justify-between gap-3 p-3 text-sm"
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-medium text-gray-900">{line.description}</span>
              <span className="text-xs text-gray-500 tabular-nums">
                {line.quantity} × {formatPrice(line.unitPriceInPaise)} excl. GST
                {line.isExtra && " · extra work"}
              </span>
            </span>
            <div role="group" aria-label={`Answer for ${line.description}`} className="flex gap-2">
              {(["approved", "rejected"] as const).map((decision) => (
                <Button
                  key={decision}
                  type="button"
                  size="sm"
                  variant="outline"
                  aria-pressed={decisions[line.id] === decision}
                  onClick={() => setDecisions((current) => ({ ...current, [line.id]: decision }))}
                  className={cn(
                    decisions[line.id] === decision &&
                      (decision === "approved"
                        ? "border-success-600 bg-success-50 text-success-700"
                        : "border-danger-600 bg-danger-50 text-danger-700"),
                  )}
                >
                  {decision === "approved" ? <Check aria-hidden /> : <X aria-hidden />}
                  {decision === "approved" ? "Approve" : "Turn down"}
                </Button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="approval-channel">How did they answer?</Label>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger id="approval-channel" className="w-full sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHANNELS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-stretch gap-1 sm:items-end">
          <span className="text-sm text-gray-700">
            Approved now:{" "}
            <strong className="tabular-nums">{formatPrice(sumLines(approved).totalInPaise)}</strong>{" "}
            incl. GST
          </span>
          <SubmitButton type="button" size="lg" isPending={isSaving} onClick={save}>
            Save customer&apos;s answer
          </SubmitButton>
        </div>
      </div>
    </div>
  );
}
