"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { SectionCard } from "@/components/ui/SectionCard";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/textarea";
import { recordQualityCheckAction } from "@/features/job-cards/actions";
import type { JobCard } from "@/features/job-cards/types";
import { approvedLines, QUALITY_CHECKLIST } from "@/features/job-cards/utils";

/** The job's own work, then the standard checks. */
function checklistFor(job: JobCard): string[] {
  const work = approvedLines(job.estimate?.lines ?? [])
    .filter((line) => line.kind === "labour" || line.kind === "service")
    .map((line) => `${line.description}: done properly`);
  return [...work, ...QUALITY_CHECKLIST];
}

export function QualityCheckForm({ job }: { job: JobCard }) {
  const router = useRouter();
  const [checks, setChecks] = useState(() =>
    checklistFor(job).map((label) => ({ label, isOk: false })),
  );
  const [note, setNote] = useState("");
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState<"pass" | "rework" | null>(null);
  const allOk = checks.every((check) => check.isOk);

  async function submit(result: "pass" | "rework") {
    if (result === "pass" && !allOk)
      return setError("Tick every check before passing the vehicle.");
    if (result === "rework" && note.trim().length < 3) return setError("Say what needs redoing.");
    setPending(result);
    const response = await recordQualityCheckAction(job.id, {
      items: checks,
      result,
      note: note.trim() || undefined,
    });
    setPending(null);
    if (!response.ok) return setError(response.message);
    toast.success(
      result === "pass" ? "Passed. Ready for delivery." : "Sent back to the technician",
    );
    router.push(`/garage/jobs/${job.id}`);
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <FormAlert message={error} />
      <SectionCard title="Checks">
        <ul className="flex flex-col divide-y divide-gray-100">
          {checks.map((check, index) => (
            <li key={check.label}>
              <label
                htmlFor={`qa-${index}`}
                className="flex min-h-12 cursor-pointer items-center gap-3 py-2 text-sm text-gray-900"
              >
                <Checkbox
                  id={`qa-${index}`}
                  checked={check.isOk}
                  onCheckedChange={(checked) =>
                    setChecks((current) =>
                      current.map((item, i) =>
                        i === index ? { ...item, isOk: checked === true } : item,
                      ),
                    )
                  }
                  className="size-6"
                />
                {check.label}
              </label>
            </li>
          ))}
        </ul>
      </SectionCard>
      <Field>
        <FieldLabel htmlFor="qa-note">Note (needed to send back for rework)</FieldLabel>
        <Textarea
          id="qa-note"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="e.g. Rear brake still drags. Adjust and re-check."
        />
      </Field>
      <div className="grid gap-2 sm:grid-cols-2">
        <SubmitButton
          type="button"
          variant="outline"
          size="lg"
          isPending={pending === "rework"}
          onClick={() => submit("rework")}
        >
          Send back for rework
        </SubmitButton>
        <SubmitButton
          type="button"
          size="lg"
          isPending={pending === "pass"}
          onClick={() => submit("pass")}
          disabled={!allOk}
        >
          Pass: ready for delivery
        </SubmitButton>
      </div>
    </div>
  );
}
