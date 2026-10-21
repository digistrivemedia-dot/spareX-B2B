"use client";

import { Plus } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import type { GarageService } from "@/features/garage/types";
import { EstimateLineRow } from "@/features/job-cards/components/EstimateLineRow";
import type { EstimateValues } from "@/features/job-cards/schemas";
import type { EstimateLine } from "@/features/job-cards/types";
import { newEstimateLine, sumLines, toLineInput } from "@/features/job-cards/utils";
import { formatPrice } from "@/lib/format";

const ADD_BUTTONS: { kind: EstimateLine["kind"]; label: string }[] = [
  { kind: "service", label: "Service" },
  { kind: "labour", label: "Labour" },
  { kind: "part", label: "Part" },
  { kind: "consumable", label: "Consumable" },
];

/** The editable lines of an estimate, with add buttons and running totals. */
export function EstimateEditor({ services }: { services: GarageService[] }) {
  const { control, formState } = useFormContext<EstimateValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "lines", keyName: "key" });
  const lines = useWatch({ control, name: "lines" });
  // Half-filled lines count as zero until their numbers are typed in.
  const totals = sumLines(
    lines.map((line) => ({
      ...toLineInput({ ...line, price: line.price || "0", quantity: line.quantity || "0" }),
      approval: "approved" as const,
      isExtra: false,
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      {fields.length > 0 && (
        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
          {fields.map((field, index) => (
            <EstimateLineRow
              key={field.key}
              index={index}
              services={services}
              onRemove={() => remove(index)}
            />
          ))}
        </ul>
      )}
      <FieldError errors={[formState.errors.lines?.root ?? formState.errors.lines]} />
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500">Add:</span>
        {ADD_BUTTONS.map(({ kind, label }) => (
          <Button
            key={kind}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append(newEstimateLine(kind))}
          >
            <Plus aria-hidden />
            {label}
          </Button>
        ))}
      </div>
      <dl className="ml-auto flex w-full max-w-xs flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-600">Subtotal (excl. GST)</dt>
          <dd className="font-medium tabular-nums">{formatPrice(totals.subtotalInPaise)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">GST</dt>
          <dd className="font-medium tabular-nums">{formatPrice(totals.gstInPaise)}</dd>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-1">
          <dt className="font-semibold text-gray-900">Total (incl. GST)</dt>
          <dd className="font-semibold text-gray-900 tabular-nums">
            {formatPrice(totals.totalInPaise)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
