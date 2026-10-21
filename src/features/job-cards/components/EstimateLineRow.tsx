"use client";

import { Trash2 } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { FormTextField } from "@/components/ui/FormTextField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GarageService } from "@/features/garage/types";
import { LineDescriptionField } from "@/features/job-cards/components/LineDescriptionField";
import {
  GST_RATES,
  type EstimateLineValues,
  type EstimateValues,
} from "@/features/job-cards/schemas";
import { ESTIMATE_KIND_LABELS } from "@/features/job-cards/utils";
import { formatPrice } from "@/lib/format";

type EstimateLineRowProps = {
  index: number;
  services: GarageService[];
  onRemove: () => void;
};

/** One estimate line: what it is, then quantity, price and GST. */
export function EstimateLineRow({ index, services, onRemove }: EstimateLineRowProps) {
  const { control } = useFormContext<EstimateValues>();
  const line = useWatch({ control, name: `lines.${index}` });
  const name = (field: keyof EstimateLineValues) => `lines.${index}.${field}` as const;
  const total = Number(line.price || 0) * Number(line.quantity || 0);

  return (
    <li className="flex flex-col gap-3 p-3">
      <div className="grid gap-3 md:grid-cols-[10rem_1fr]">
        {/* A fixed kind column keeps the descriptions lined up. */}
        <Controller
          control={control}
          name={`lines.${index}.kind`}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={`${name("kind")}-select`}>Type</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={`${name("kind")}-select`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ESTIMATE_KIND_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <LineDescriptionField index={index} kind={line.kind} services={services} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-[6rem_8rem_7rem_1fr_auto] sm:items-start">
        {/* Fixed widths line the numbers up across rows. */}
        <FormTextField
          control={control}
          name={`lines.${index}.quantity`}
          label="Qty"
          inputMode="numeric"
        />
        <FormTextField
          control={control}
          name={`lines.${index}.price`}
          label="Price (excl. GST)"
          inputMode="decimal"
          prefixText="₹"
        />
        <Controller
          control={control}
          name={`lines.${index}.gst`}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={`${name("gst")}-select`}>GST</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={`${name("gst")}-select`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GST_RATES.map((rate) => (
                    <SelectItem key={rate} value={rate}>
                      {rate}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <div className="flex flex-col gap-1.5 sm:items-end">
          <span className="text-sm font-medium text-gray-900">Line total</span>
          <span className="flex h-9 items-center text-sm font-semibold text-gray-900 tabular-nums">
            {formatPrice(Math.round(total * 100))}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          aria-label={`Remove line ${index + 1}`}
          className="self-end text-gray-500 hover:text-danger-700"
        >
          <Trash2 aria-hidden />
        </Button>
      </div>
    </li>
  );
}
