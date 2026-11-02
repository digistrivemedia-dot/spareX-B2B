import { Check, Minus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { JobCard } from "@/features/job-cards/types";
import { getFinishedStages, getJobStages, type JobStage } from "@/features/job-cards/utils";
import { cn } from "@/lib/utils";

type StageState = "done" | "current" | "upcoming" | "skipped";

const STATE_TEXT: Record<StageState, string> = {
  done: "done",
  current: "next",
  upcoming: "to come",
  skipped: "not needed",
};

/** Every stage of the job with a tick once it's finished, so the job card reads at a glance. */
export function JobProgress({ job }: { job: JobCard }) {
  const stages = getJobStages(job);
  const finished = getFinishedStages(job);
  const current = stages.find(({ key }) => !finished.has(key))?.key;
  const stateOf = (key: JobStage): StageState => {
    if (finished.has(key)) return "done";
    // A closed job (estimate turned down) skips everything it never reached.
    if (job.status === "closed") return "skipped";
    return key === current ? "current" : "upcoming";
  };

  return (
    <Card>
      <CardContent>
        <ol
          aria-label="Job stages"
          className={cn(
            "grid grid-cols-5 gap-x-2 gap-y-4",
            stages.length > 9 ? "lg:grid-cols-10" : "lg:grid-cols-9",
          )}
        >
          {stages.map(({ key, label }, index) => {
            const state = stateOf(key);
            return (
              <li key={key} className="flex flex-col items-center gap-1.5 text-center">
                <span
                  aria-hidden
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold",
                    state === "done" && "border-success-700 bg-success-700 text-white",
                    state === "current" && "border-orange-600 bg-orange-50 text-orange-700",
                    state === "upcoming" && "border-gray-200 bg-white text-gray-500",
                    state === "skipped" && "border-dashed border-gray-300 bg-gray-50 text-gray-400",
                  )}
                >
                  {state === "done" ? (
                    <Check className="size-4" />
                  ) : state === "skipped" ? (
                    <Minus className="size-4" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "text-xs leading-tight",
                    state === "current" ? "font-semibold text-gray-900" : "text-gray-600",
                  )}
                >
                  {label}
                  <span className="sr-only">: {STATE_TEXT[state]}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
