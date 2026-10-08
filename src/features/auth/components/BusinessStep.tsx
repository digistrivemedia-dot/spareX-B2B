"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { FormTextField } from "@/components/ui/FormTextField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RegisterValues } from "@/features/auth/schemas";
import { BUSINESS_TYPE_LABELS, BUSINESS_TYPES } from "@/features/company/business-types";
import { getPanFromGstin, getStateFromGstin, isValidGstin } from "@/lib/gst";

/**
 * GSTINs are 15 upper-case characters; accept them however they are typed or pasted.
 * (No maxLength on the input: it would cut a pasted "29AAKFS 4821M1Z3" before the space goes.)
 */
const toGstinFormat = (value: string) => value.toUpperCase().replace(/\s/g, "").slice(0, 15);

export function BusinessStep() {
  const { control, setValue } = useFormContext<RegisterValues>();
  const gstin = useWatch({ control, name: "gstin" });
  const gstinState = isValidGstin(gstin) ? getStateFromGstin(gstin) : undefined;

  function fillPanFromGstin(value: string) {
    const isValid = isValidGstin(value);
    setValue("pan", isValid ? getPanFromGstin(value) : "", { shouldValidate: isValid });
  }

  return (
    <>
      <FormTextField
        control={control}
        name="businessName"
        label="Business name"
        autoComplete="organization"
        description="As it appears on your GST registration certificate."
      />
      <Controller
        control={control}
        name="businessType"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="businessType">Business type</FieldLabel>
            <Select name={field.name} value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger
                ref={field.ref}
                id="businessType"
                onBlur={field.onBlur}
                aria-invalid={fieldState.invalid}
                className="w-full"
              >
                <SelectValue placeholder="Choose your business type" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {BUSINESS_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <FormTextField
        control={control}
        name="gstin"
        label="GSTIN"
        autoCapitalize="characters"
        spellCheck={false}
        normalize={toGstinFormat}
        onValueChange={fillPanFromGstin}
        description={
          gstinState
            ? `Registered in ${gstinState}. We've filled in your PAN below.`
            : "15 characters, e.g. 29AAKFS4821M1Z3."
        }
      />
      <FormTextField
        control={control}
        name="pan"
        label="PAN"
        readOnly
        tabIndex={-1}
        placeholder="Filled in from your GSTIN"
        description="Characters 3 to 12 of your GSTIN."
      />
    </>
  );
}
