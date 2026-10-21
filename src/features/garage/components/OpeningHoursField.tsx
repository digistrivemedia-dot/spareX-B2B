"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { GarageProfileValues } from "@/features/garage/schemas";
import { WEEKDAY_LABELS } from "@/features/garage/utils";

/** One row per weekday: open or closed, and the hours. */
export function OpeningHoursField() {
  const { control, register, formState } = useFormContext<GarageProfileValues>();
  const hours = useWatch({ control, name: "openingHours" });

  return (
    <ul className="flex flex-col divide-y divide-gray-100 rounded-lg border border-gray-200">
      {hours.map((day, index) => {
        const label = WEEKDAY_LABELS[day.day];
        const error = formState.errors.openingHours?.[index]?.closesAt;
        return (
          <li key={day.day} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2">
            <Controller
              control={control}
              name={`openingHours.${index}.isOpen`}
              render={({ field }) => (
                <label className="flex min-h-10 w-36 items-center gap-2 text-sm font-medium text-gray-900">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    aria-label={`Open on ${label}`}
                  />
                  {label}
                </label>
              )}
            />
            {day.isOpen ? (
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Input
                  type="time"
                  aria-label={`${label} opens at`}
                  className="w-32"
                  {...register(`openingHours.${index}.opensAt`)}
                />
                to
                <Input
                  type="time"
                  aria-label={`${label} closes at`}
                  aria-invalid={Boolean(error)}
                  className="w-32"
                  {...register(`openingHours.${index}.closesAt`)}
                />
              </span>
            ) : (
              <span className="text-sm text-gray-500">Closed</span>
            )}
            {error && <FieldError errors={[error]} className="basis-full" />}
          </li>
        );
      })}
    </ul>
  );
}
