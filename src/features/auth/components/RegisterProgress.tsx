import { cva } from "class-variance-authority";
import { Check } from "lucide-react";

import { REGISTER_STEPS } from "@/features/auth/schemas";
import { cn } from "@/lib/utils";

const markerVariants = cva(
  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
  {
    variants: {
      state: {
        done: "bg-navy-700 text-white",
        current: "bg-orange-700 text-white",
        upcoming: "border border-gray-300 bg-white text-gray-500",
      },
    },
  },
);

type RegisterProgressProps = {
  /** Index of the step being shown. */
  currentStep: number;
};

export function RegisterProgress({ currentStep }: RegisterProgressProps) {
  return (
    <ol aria-label="Registration progress" className="mb-6 flex items-center gap-2">
      {REGISTER_STEPS.map((step, index) => {
        const state = index < currentStep ? "done" : index === currentStep ? "current" : "upcoming";
        return (
          <li
            key={step.label}
            aria-current={state === "current" ? "step" : undefined}
            className="flex flex-1 items-center gap-2"
          >
            <span className={markerVariants({ state })}>
              {state === "done" ? <Check aria-hidden className="size-3.5" /> : index + 1}
            </span>
            <span
              className={cn(
                "text-sm",
                state === "upcoming" ? "text-gray-500" : "font-medium text-gray-900",
                // Four labels don't fit a phone, so only the current one shows there.
                state !== "current" && "sr-only sm:not-sr-only",
              )}
            >
              {step.label}
              {state === "done" && <span className="sr-only"> (done)</span>}
            </span>
            {index < REGISTER_STEPS.length - 1 && (
              <span aria-hidden className="h-px flex-1 bg-gray-200" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
