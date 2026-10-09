import { cva } from "class-variance-authority";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const markerVariants = cva(
  "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
  {
    variants: {
      state: {
        done: "border-navy-700 bg-navy-700 text-white",
        current: "border-orange-700 bg-white",
        upcoming: "border-gray-300 bg-white",
        stopped: "border-gray-400 bg-gray-400 text-white",
      },
    },
  },
);

export type TimelineStep = {
  label: string;
  /** Already formatted, e.g. "4 Oct 2026, 10:15". */
  when?: string;
  note?: string;
  state: "done" | "current" | "upcoming" | "stopped";
};

/** A vertical list of steps: what has happened, what is happening now, what comes next. */
export function Timeline({ steps, label }: { steps: TimelineStep[]; label: string }) {
  return (
    <ol aria-label={label} className="flex flex-col">
      {steps.map((step, index) => (
        <li
          key={`${step.label}-${index}`}
          aria-current={step.state === "current" ? "step" : undefined}
          className="relative flex gap-3 pb-5 last:pb-0"
        >
          {index < steps.length - 1 && (
            <span
              aria-hidden
              className={cn(
                "absolute top-6 left-3 h-full w-0.5 -translate-x-1/2",
                step.state === "done" ? "bg-navy-700" : "bg-gray-200",
              )}
            />
          )}
          <span className={markerVariants({ state: step.state })}>
            {step.state === "done" && <Check aria-hidden className="size-3.5" />}
            {step.state === "current" && <span className="size-2 rounded-full bg-orange-700" />}
          </span>
          <div className="flex flex-col gap-0.5 pt-0.5">
            <span
              className={cn(
                "text-sm font-medium",
                step.state === "upcoming" ? "text-gray-500" : "text-gray-900",
              )}
            >
              {step.label}
              <span className="sr-only">
                {step.state === "done" ? " (done)" : step.state === "current" ? " (now)" : ""}
              </span>
            </span>
            {step.when && <span className="text-xs text-gray-500">{step.when}</span>}
            {step.note && <span className="text-xs text-gray-600">{step.note}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
}
