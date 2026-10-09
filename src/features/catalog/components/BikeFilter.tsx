"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BikeModel } from "@/features/catalog/types";

// Radix Select can't use "" as an item value, so "any" stands for "no filter".
const ANY = "any";

type BikeFilterProps = {
  bikeModels: BikeModel[];
  make?: string;
  bikeId?: string;
  onChange: (make: string | null, bikeId: string | null) => void;
};

/** Make first, then model: "fits KTM" or "fits KTM Duke 200". */
export function BikeFilter({ bikeModels, make, bikeId, onChange }: BikeFilterProps) {
  const makes = [...new Set(bikeModels.map((bike) => bike.brand))];
  const models = bikeModels.filter((bike) => bike.brand === make);

  return (
    <div className="flex flex-col gap-3">
      <Field>
        <FieldLabel htmlFor="filter-make" className="text-xs text-gray-500">
          Make
        </FieldLabel>
        <Select
          value={make ?? ANY}
          onValueChange={(value) => onChange(value === ANY ? null : value, null)}
        >
          <SelectTrigger id="filter-make" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any make</SelectItem>
            {makes.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field data-disabled={!make}>
        <FieldLabel htmlFor="filter-model" className="text-xs text-gray-500">
          Model
        </FieldLabel>
        <Select
          value={bikeId ?? ANY}
          onValueChange={(value) => onChange(make ?? null, value === ANY ? null : value)}
          disabled={!make}
        >
          <SelectTrigger id="filter-model" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>
              {make ? `Any ${make} model` : "Choose a make first"}
            </SelectItem>
            {models.map((bike) => (
              <SelectItem key={bike.id} value={bike.id}>
                {bike.model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
