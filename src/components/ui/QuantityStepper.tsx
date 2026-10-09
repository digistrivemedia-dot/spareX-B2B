"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { snapQuantity, type QuantityRules } from "@/lib/quantity";

type QuantityStepperProps = QuantityRules & {
  value: number;
  onChange: (value: number) => void;
  /** Accessible name, e.g. "Quantity of Motul 7100". */
  label: string;
  /** For focusing the number field from elsewhere, e.g. after picking a part. */
  id?: string;
  /** Called after Enter commits the typed quantity, e.g. to move to the next row. */
  onEnter?: () => void;
};

/**
 * − / + buttons step by whole packs; typed values snap to the nearest allowed quantity
 * when the field loses focus or Enter is pressed.
 */
export function QuantityStepper({
  value,
  onChange,
  label,
  min,
  step,
  id,
  onEnter,
}: QuantityStepperProps) {
  // What is being typed; null when the field shows the committed value.
  const [draft, setDraft] = useState<string | null>(null);

  function commit() {
    if (draft === null) return;
    const typed = Number.parseInt(draft, 10);
    onChange(snapQuantity(Number.isNaN(typed) ? min : typed, { min, step }));
    setDraft(null);
  }

  return (
    <div className="inline-flex items-center rounded-lg border border-input bg-white">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
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
        onClick={() => onChange(value + step)}
        aria-label={`Increase ${label.toLowerCase()}`}
        className="rounded-l-none"
      >
        <Plus aria-hidden />
      </Button>
    </div>
  );
}
