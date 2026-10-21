"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PartNumberInput } from "@/features/catalog/components/PartNumberInput";
import type { GarageService } from "@/features/garage/types";
import type { EstimateLineValues, EstimateValues } from "@/features/job-cards/schemas";
import { formatPrice } from "@/lib/format";

type LineDescriptionFieldProps = {
  index: number;
  kind: EstimateLineValues["kind"];
  services: GarageService[];
};

/**
 * What the line is: a part searched in the SpareX catalogue (filling its number and price), a
 * service from the garage's price list, or free text for labour and consumables.
 */
export function LineDescriptionField({ index, kind, services }: LineDescriptionFieldProps) {
  const { control, setValue } = useFormContext<EstimateValues>();
  const id = `lines.${index}.description-input`;

  return (
    <Controller
      control={control}
      name={`lines.${index}.description`}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>
            {kind === "part" ? "Part (search SpareX by name or number)" : "Description"}
          </FieldLabel>
          {kind === "part" ? (
            <PartNumberInput
              id={id}
              label="Part"
              value={field.value}
              onChange={field.onChange}
              isInvalid={fieldState.invalid}
              onSelect={(product) => {
                field.onChange(product.name);
                setValue(`lines.${index}.partNumber`, product.partNumber);
                // Garages sell parts on at MRP; the builder shows prices excluding GST.
                setValue(`lines.${index}.price`, String(Math.round(product.mrpInPaise / 118)));
              }}
            />
          ) : kind === "service" ? (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                const service = services.find((candidate) => candidate.name === value);
                if (service) setValue(`lines.${index}.price`, String(service.priceInPaise / 100));
              }}
            >
              <SelectTrigger id={id} className="w-full" aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Choose from your services" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.name}>
                    {service.name} · {formatPrice(service.priceInPaise)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              {...field}
              id={id}
              aria-invalid={fieldState.invalid}
              placeholder={kind === "labour" ? "e.g. Clutch overhaul" : "e.g. Grease, 100 g"}
            />
          )}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
