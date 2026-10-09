"use client";

import { Controller, type Control } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { FormTextField } from "@/components/ui/FormTextField";
import { Textarea } from "@/components/ui/textarea";
import type { CheckoutValues } from "@/features/checkout/schemas";

/** Your own PO reference, its date, and notes for the warehouse: all optional. */
export function PurchaseOrderFields({ control }: { control: Control<CheckoutValues> }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormTextField
          control={control}
          name="poNumber"
          label="Your PO number (optional)"
          placeholder="e.g. PO/SSW/2026/042"
          description="Printed on the GST invoice so your accounts team can match it."
        />
        <FormTextField control={control} name="poDate" label="PO date (optional)" type="date" />
      </div>
      <Controller
        control={control}
        name="notes"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="notes">Notes for the warehouse (optional)</FieldLabel>
            <Textarea
              {...field}
              id="notes"
              rows={3}
              placeholder="e.g. Deliver after 10 am; call Ravi on arrival."
              aria-invalid={fieldState.invalid}
              aria-describedby="notes-description"
            />
            <FieldDescription id="notes-description">
              Delivery timings, who to call, how to pack.
            </FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </div>
  );
}
