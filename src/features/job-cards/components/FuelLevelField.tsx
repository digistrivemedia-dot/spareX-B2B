"use client";

import { Controller, useFormContext } from "react-hook-form";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CheckInValues } from "@/features/job-cards/schemas";
import type { FuelLevel } from "@/features/job-cards/types";
import { FUEL_LEVEL_LABELS } from "@/features/job-cards/utils";

/** Five big targets from empty to full, easy to tap on a phone in the workshop. */
export function FuelLevelField() {
  const { control } = useFormContext<CheckInValues>();

  return (
    <Controller
      control={control}
      name="fuelLevel"
      render={({ field }) => (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-gray-900">Fuel level</legend>
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="grid grid-cols-5 gap-2"
          >
            {(Object.keys(FUEL_LEVEL_LABELS) as FuelLevel[]).map((level) => (
              <label
                key={level}
                htmlFor={`fuel-${level}`}
                className="flex h-12 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-sm font-medium text-gray-700 has-data-[state=checked]:border-navy-700 has-data-[state=checked]:bg-navy-50 has-data-[state=checked]:text-navy-800 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
              >
                <RadioGroupItem id={`fuel-${level}`} value={level} className="sr-only" />
                {FUEL_LEVEL_LABELS[level]}
              </label>
            ))}
          </RadioGroup>
        </fieldset>
      )}
    />
  );
}
