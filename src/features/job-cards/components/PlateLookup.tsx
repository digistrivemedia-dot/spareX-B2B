"use client";

import { Search } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { FormTextField } from "@/components/ui/FormTextField";
import { NumberPlate } from "@/components/ui/NumberPlate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Branch } from "@/features/company/types";
import type { VehicleLookup } from "@/features/customers/api";
import type { WalkInValues } from "@/features/job-cards/schemas";
import { formatPhone } from "@/lib/format";

type PlateLookupProps = {
  lookup: VehicleLookup | "not_found" | null;
  onFind: () => void;
  onChange: () => void;
  /** Given to owners, who can open the job at any branch. */
  branches?: Branch[];
};

/** The number plate box: search it, then see the vehicle and owner on file (or that it's new). */
export function PlateLookup({ lookup, onFind, onChange, branches }: PlateLookupProps) {
  const { control } = useFormContext<WalkInValues>();
  const found = lookup && lookup !== "not_found" ? lookup : null;

  return (
    <div className="flex flex-col gap-5">
      {branches && (
        <Controller
          control={control}
          name="branchId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="walk-in-branch">Branch</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="walk-in-branch" className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <FormTextField
            control={control}
            name="plate"
            label="Number plate"
            placeholder="KA 01 AB 1234"
            autoCapitalize="characters"
            autoFocus
            readOnly={Boolean(lookup)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || lookup) return;
              event.preventDefault();
              onFind();
            }}
          />
        </div>
        {lookup ? (
          <Button type="button" variant="outline" onClick={onChange} className="sm:mt-6">
            Change plate
          </Button>
        ) : (
          <Button type="button" onClick={onFind} className="sm:mt-6">
            <Search aria-hidden />
            Find vehicle
          </Button>
        )}
      </div>
      {found && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg bg-success-50 p-3 text-sm">
          <NumberPlate plate={found.vehicle.plate} />
          <span className="text-gray-900">
            {found.vehicle.make} {found.vehicle.model} · {found.customer.name},{" "}
            {formatPhone(found.customer.phone)}
          </span>
        </div>
      )}
      {lookup === "not_found" && (
        <p className="rounded-lg bg-info-50 p-3 text-sm text-info-700">
          This plate is new to your garage. Add the vehicle and its owner below.
        </p>
      )}
    </div>
  );
}
