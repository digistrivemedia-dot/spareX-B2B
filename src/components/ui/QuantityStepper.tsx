"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const MIN_QUANTITY = 1;

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  /** Accessible name, e.g. "Quantity of Motul 7100". */
  label: string;
  /** The most that can be chosen, e.g. what is left to return. */
  max?: number;
  /** For focusing the number field from elsewhere, e.g. after picking a part. */
  id?: string;
  /** Called after Enter commits the typed quantity, e.g. to move to the next row. */
  onEnter?: () => void;
};

/** − / + buttons and a number field; a typed value is committed on blur or Enter (at least 1). */
export function QuantityStepper({
  value,
  onChange,
  label,
  max = Infinity,
  id,
  onEnter,
}: QuantityStepperProps) {
  const clamp = (quantity: number) => Math.min(max, Math.max(MIN_QUANTITY, quantity));

  // What is being typed; null when the field shows the committed value.
  const [draft, setDraft] = useState<string | null>(null);

  function commit() {
    if (draft === null) return;
    const typed = Number.parseInt(draft, 10);
    onChange(clamp(Number.isNaN(typed) ? MIN_QUANTITY : typed));
    setDraft(null);
  }

  return (
    <div className="inline-flex items-center rounded-lg border border-input bg-white">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= MIN_QUANTITY}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className="rounded-r-none"
      >
        <Minus aria-hidden />
      </Button>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={draft ?? String(value)}
        onChange={(event) => setDraft(event.target.value.replace(/\D/g, ""))}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          // Enter confirms the quantity here; it must not also submit a surrounding form.
          event.preventDefault();
          commit();
          onEnter?.();
        }}
        className="h-8 w-10 border-x border-input text-center text-sm font-medium text-gray-900 tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
        className="rounded-l-none"
      >
        <Plus aria-hidden />
      </Button>
    </div>
  );
}
