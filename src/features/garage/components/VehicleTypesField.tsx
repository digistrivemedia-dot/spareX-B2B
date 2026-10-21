"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field";
import type { VehicleType } from "@/features/catalog/types";
import { VEHICLE_TYPE_LABELS } from "@/features/catalog/utils";
import type { GarageProfileValues } from "@/features/garage/schemas";

const TYPES = Object.keys(VEHICLE_TYPE_LABELS) as VehicleType[];

export function VehicleTypesField() {
  const { control } = useFormContext<GarageProfileValues>();

  return (
    <Controller
      control={control}
      name="vehicleTypes"
      render={({ field, fieldState }) => (
        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Vehicle types you service</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {TYPES.map((type) => (
              <label key={type} className="flex min-h-10 items-center gap-2 text-sm text-gray-700">
                <Checkbox
                  checked={field.value.includes(type)}
                  onCheckedChange={(checked) =>
                    field.onChange(
                      checked === true
                        ? [...field.value, type]
                        : field.value.filter((selected) => selected !== type),
                    )
                  }
                />
                {VEHICLE_TYPE_LABELS[type]}
              </label>
            ))}
          </div>
          <FieldError errors={[fieldState.error]} />
        </fieldset>
      )}
    />
  );
}
