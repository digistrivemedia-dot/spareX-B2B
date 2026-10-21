"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VehicleType } from "@/features/catalog/types";
import { VEHICLE_TYPE_LABELS } from "@/features/catalog/utils";

type VehicleTypeSelectProps = {
  id: string;
  value: VehicleType;
  onChange: (type: VehicleType) => void;
};

/** A labelled picker for the vehicle type: two-wheeler, three-wheeler, car or commercial. */
export function VehicleTypeSelect({ id, value, onChange }: VehicleTypeSelectProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>Vehicle type</FieldLabel>
      <Select value={value} onValueChange={(type) => onChange(type as VehicleType)}>
        <SelectTrigger id={id} className="w-full sm:w-64">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(VEHICLE_TYPE_LABELS).map(([type, label]) => (
            <SelectItem key={type} value={type}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
