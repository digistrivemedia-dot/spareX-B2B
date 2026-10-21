"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VehicleModel, VehicleType } from "@/features/catalog/types";
import { VEHICLE_TYPE_LABELS } from "@/features/catalog/utils";

// Radix Select can't use "" as an item value, so "any" stands for "no filter".
const ANY = "any";

export type VehicleSelection = { type?: VehicleType; make?: string; model?: string };

type VehicleFilterProps = {
  vehicleModels: VehicleModel[];
  value: VehicleSelection;
  onChange: (value: VehicleSelection) => void;
};

/** Type, then make, then model: "fits cars", "fits Maruti Suzuki cars" or "fits Swift". */
export function VehicleFilter({ vehicleModels, value, onChange }: VehicleFilterProps) {
  const types = [...new Set(vehicleModels.map((vehicle) => vehicle.type))];
  const ofType = vehicleModels.filter((vehicle) => vehicle.type === value.type);
  const makes = [...new Set(ofType.map((vehicle) => vehicle.brand))];
  const models = ofType.filter((vehicle) => vehicle.brand === value.make);
  const pick = (picked: string) => (picked === ANY ? undefined : picked);

  return (
    <div className="flex flex-col gap-3">
      <FilterSelect
        id="filter-vehicle-type"
        label="Vehicle type"
        value={value.type}
        anyLabel="Any vehicle"
        options={types.map((type) => ({ value: type, label: VEHICLE_TYPE_LABELS[type] }))}
        onChange={(type) => onChange({ type: pick(type) as VehicleType | undefined })}
      />
      <FilterSelect
        id="filter-make"
        label="Make"
        value={value.make}
        anyLabel={value.type ? "Any make" : "Choose a type first"}
        disabled={!value.type}
        options={makes.map((make) => ({ value: make, label: make }))}
        onChange={(make) => onChange({ type: value.type, make: pick(make) })}
      />
      <FilterSelect
        id="filter-model"
        label="Model"
        value={value.model}
        anyLabel={value.make ? `Any ${value.make} model` : "Choose a make first"}
        disabled={!value.make}
        options={models.map((vehicle) => ({ value: vehicle.id, label: vehicle.model }))}
        onChange={(model) => onChange({ ...value, model: pick(model) })}
      />
    </div>
  );
}

type FilterSelectProps = {
  id: string;
  label: string;
  value?: string;
  anyLabel: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

function FilterSelect({
  id,
  label,
  value,
  anyLabel,
  options,
  disabled,
  onChange,
}: FilterSelectProps) {
  return (
    <Field data-disabled={disabled}>
      <FieldLabel htmlFor={id} className="text-xs text-gray-500">
        {label}
      </FieldLabel>
      <Select value={value ?? ANY} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>{anyLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
