"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormTextField } from "@/components/ui/FormTextField";
import type { GarageProfileValues } from "@/features/garage/schemas";

/** Days the garage is shut; customers can't book them. */
export function HolidaysField() {
  const { control } = useFormContext<GarageProfileValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "holidays", keyName: "key" });

  return (
    <div className="flex flex-col gap-3">
      {fields.length > 0 ? (
        <ul className="flex flex-col divide-y divide-gray-100 rounded-lg border border-gray-200">
          {fields.map((holiday, index) => (
            <li
              key={holiday.key}
              className="grid gap-3 p-3 sm:grid-cols-[11rem_1fr_auto] sm:items-start"
            >
              {/* A fixed date column keeps the rows lined up. */}
              <FormTextField
                control={control}
                name={`holidays.${index}.date`}
                label="Date"
                type="date"
              />
              <FormTextField control={control} name={`holidays.${index}.name`} label="Holiday" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                aria-label={`Remove ${holiday.name || "this holiday"}`}
                className="text-gray-500 hover:text-danger-700 sm:mt-6"
              >
                <Trash2 aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No holidays added.</p>
      )}
      <Button
        type="button"
        variant="outline"
        className="self-start"
        onClick={() => append({ date: "", name: "" })}
      >
        <Plus aria-hidden />
        Add holiday
      </Button>
    </div>
  );
}
