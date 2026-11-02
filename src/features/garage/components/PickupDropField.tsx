"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { FormTextField } from "@/components/ui/FormTextField";
import type { GarageProfileValues } from "@/features/garage/schemas";

/** Whether customers can ask the garage to fetch and return their vehicle, and on what terms. */
export function PickupDropField() {
  const { control } = useFormContext<GarageProfileValues>();
  const isOffered = useWatch({ control, name: "pickupDrop.isOffered" });

  return (
    <div className="flex flex-col gap-5">
      <Controller
        control={control}
        name="pickupDrop.isOffered"
        render={({ field }) => (
          <label className="flex min-h-10 items-center gap-2 text-sm text-gray-700">
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            Offer pick-up & drop: we fetch the vehicle and bring it back
          </label>
        )}
      />
      {isOffered && (
        <div className="grid gap-5 sm:grid-cols-2 lg:w-2/3">
          <FormTextField
            control={control}
            name="pickupDrop.fee"
            label="Fee per job, both ways (₹, excl. GST)"
            inputMode="decimal"
            prefixText="₹"
            description="Added to the estimate and the bill."
          />
          <FormTextField
            control={control}
            name="pickupDrop.radiusKm"
            label="How far you go (km from the branch)"
            inputMode="numeric"
            description="Customers further away can't choose it."
          />
        </div>
      )}
    </div>
  );
}
