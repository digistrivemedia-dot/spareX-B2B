"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { FormTextField } from "@/components/ui/FormTextField";
import type { GarageProfileValues } from "@/features/garage/schemas";

/** The services customers can book, each with the garage's own price and time. */
export function ServicesField() {
  const { control, formState } = useFormContext<GarageProfileValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "services", keyName: "key" });

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col divide-y divide-gray-100 rounded-lg border border-gray-200">
        {fields.map((service, index) => (
          <li
            key={service.key}
            className="grid gap-3 p-3 sm:grid-cols-[1fr_8rem_8rem_auto] sm:items-start"
          >
            {/* Fixed widths keep price and time columns lined up across rows. */}
            <FormTextField control={control} name={`services.${index}.name`} label="Service" />
            <FormTextField
              control={control}
              name={`services.${index}.price`}
              label="Price (excl. GST)"
              inputMode="decimal"
              prefixText="₹"
            />
            <FormTextField
              control={control}
              name={`services.${index}.duration`}
              label="Minutes"
              inputMode="numeric"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              aria-label={`Remove ${service.name || "this service"}`}
              className="text-gray-500 hover:text-danger-700 sm:mt-6"
            >
              <Trash2 aria-hidden />
            </Button>
          </li>
        ))}
      </ul>
      <FieldError errors={[formState.errors.services?.root ?? formState.errors.services]} />
      <Button
        type="button"
        variant="outline"
        className="self-start"
        onClick={() => append({ id: `svc-${Date.now()}`, name: "", price: "", duration: "60" })}
      >
        <Plus aria-hidden />
        Add service
      </Button>
    </div>
  );
}
