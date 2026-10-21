"use client";

import { Controller, type Control } from "react-hook-form";

import { FieldError } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ReturnValues } from "@/features/returns/schemas";
import { RETURN_REASON_LABELS } from "@/features/returns/utils";

export function ReturnReasonField({ control }: { control: Control<ReturnValues> }) {
  return (
    <Controller
      control={control}
      name="reason"
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-2">
          <RadioGroup
            aria-label="Reason for the return"
            value={field.value ?? ""}
            onValueChange={field.onChange}
            className="grid gap-1 sm:grid-cols-2"
          >
            {Object.entries(RETURN_REASON_LABELS).map(([value, label]) => (
              <label
                key={value}
                htmlFor={`reason-${value}`}
                className="flex min-h-10 items-center gap-3 rounded-lg px-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <RadioGroupItem id={`reason-${value}`} value={value} />
                {label}
              </label>
            ))}
          </RadioGroup>
          <FieldError errors={[fieldState.error]} />
        </div>
      )}
    />
  );
}
