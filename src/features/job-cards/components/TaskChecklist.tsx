"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import { setLineDoneAction } from "@/features/job-cards/actions";
import type { EstimateLine } from "@/features/job-cards/types";
import { ESTIMATE_KIND_LABELS } from "@/features/job-cards/utils";
import { cn } from "@/lib/utils";

type TaskChecklistProps = {
  jobId: string;
  /** The approved lines: the work to do and the parts to fit. */
  lines: EstimateLine[];
  isEditable: boolean;
};

/** Big tick boxes for each approved task and part; each tick saves straight away. */
export function TaskChecklist({ jobId, lines, isEditable }: TaskChecklistProps) {
  const [optimistic, setOptimistic] = useOptimistic(
    lines,
    (current, { id, isDone }: { id: string; isDone: boolean }) =>
      current.map((line) => (line.id === id ? { ...line, isDone } : line)),
  );
  const [, startTransition] = useTransition();

  function toggle(id: string, isDone: boolean) {
    startTransition(async () => {
      setOptimistic({ id, isDone });
      const result = await setLineDoneAction(jobId, id, isDone);
      if (!result.ok) toast.error(result.message);
    });
  }

  return (
    <ul className="flex flex-col divide-y divide-gray-100">
      {optimistic.map((line) => (
        <li key={line.id}>
          <label
            htmlFor={`task-${line.id}`}
            className={cn(
              "flex min-h-14 items-center gap-3 py-2 text-sm",
              isEditable ? "cursor-pointer" : "cursor-default",
            )}
          >
            <Checkbox
              id={`task-${line.id}`}
              checked={Boolean(line.isDone)}
              disabled={!isEditable}
              onCheckedChange={(checked) => toggle(line.id, checked === true)}
              className="size-6"
            />
            <span className="flex flex-col">
              <span
                className={cn(
                  "font-medium text-gray-900",
                  line.isDone && "text-gray-500 line-through",
                )}
              >
                {line.description}
              </span>
              <span className="text-xs text-gray-500">
                {ESTIMATE_KIND_LABELS[line.kind]}
                {line.quantity > 1 && ` × ${line.quantity}`}
                {line.partNumber && ` · ${line.partNumber}`}
              </span>
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
