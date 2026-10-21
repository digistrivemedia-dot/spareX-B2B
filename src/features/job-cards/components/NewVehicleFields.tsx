"use client";

import { Controller, useFormContext } from "react-hook-form";

import { FieldGroup } from "@/components/ui/field";
import { FormTextField } from "@/components/ui/FormTextField";
import { VehicleTypeSelect } from "@/features/catalog/components/VehicleTypeSelect";
import type { WalkInValues } from "@/features/job-cards/schemas";
import { toMobileDigits } from "@/lib/input-format";

/** A vehicle the garage hasn't seen before, and who it belongs to. */
export function NewVehicleFields() {
  const { control } = useFormContext<WalkInValues>();

  return (
    <FieldGroup className="mt-5">
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <VehicleTypeSelect id="vehicle-type" value={field.value} onChange={field.onChange} />
        )}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormTextField control={control} name="make" label="Make" placeholder="e.g. Honda" />
        <FormTextField control={control} name="model" label="Model" placeholder="e.g. Activa 6G" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormTextField control={control} name="customerName" label="Customer's name" />
        <FormTextField
          control={control}
          name="customerPhone"
          label="Customer's mobile"
          type="tel"
          inputMode="numeric"
          prefixText="+91"
          normalize={toMobileDigits}
          description="If they already visit you with another vehicle, we'll link them."
        />
      </div>
    </FieldGroup>
  );
}
