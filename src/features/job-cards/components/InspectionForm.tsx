"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { FormAlert } from "@/components/ui/FormAlert";
import { SectionCard } from "@/components/ui/SectionCard";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { saveInspectionAction } from "@/features/job-cards/actions";
import { InspectionItemRow } from "@/features/job-cards/components/InspectionItemRow";
import type { InspectionItem, JobCard } from "@/features/job-cards/types";
import { INSPECTION_CHECKLIST } from "@/features/job-cards/utils";

/** The standard checklist, or the saved results when the inspection is being corrected. */
function startingItems(job: JobCard): InspectionItem[] {
  if (job.inspection) return job.inspection.items;
  return INSPECTION_CHECKLIST.flatMap(({ area, items }) =>
    items.map((name, index) => ({
      id: `${job.id}-${area}-${index}`.replaceAll(" ", "-").toLowerCase(),
      area,
      name,
      result: "ok" as const,
      photos: [],
    })),
  );
}

export function InspectionForm({ job, nextHref }: { job: JobCard; nextHref: string }) {
  const router = useRouter();
  const [items, setItems] = useState(() => startingItems(job));
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const areas = [...new Set(items.map((item) => item.area))];
  const flagged = items.filter((item) => item.result !== "ok").length;

  const update = (id: string, changes: Partial<InspectionItem>) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));

  async function save() {
    const missingNote = items.find((item) => item.result !== "ok" && !item.note?.trim());
    if (missingNote)
      return setError(`Add a note for "${missingNote.name}" so the estimate is clear.`);
    setIsSaving(true);
    const result = await saveInspectionAction(job.id, { items });
    setIsSaving(false);
    if (!result.ok) return setError(result.message);
    toast.success(
      flagged ? `Inspection saved: ${flagged} items need work` : "Inspection saved: all OK",
    );
    router.push(nextHref);
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <FormAlert message={error} />
      {areas.map((area) => (
        <SectionCard key={area} title={area}>
          <ul className="flex flex-col divide-y divide-gray-100">
            {items
              .filter((item) => item.area === area)
              .map((item) => (
                <InspectionItemRow
                  key={item.id}
                  item={item}
                  onChange={(changes) => update(item.id, changes)}
                />
              ))}
          </ul>
        </SectionCard>
      ))}
      {/* Sticky so the inspection can be saved from anywhere on a phone. */}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <span className="text-sm text-gray-700">
          {flagged ? `${flagged} items need work` : "Everything is OK so far"}
        </span>
        <SubmitButton type="button" size="lg" isPending={isSaving} onClick={save}>
          Save inspection
        </SubmitButton>
      </div>
    </div>
  );
}
