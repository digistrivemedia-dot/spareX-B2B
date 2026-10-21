"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { FormTextField } from "@/components/ui/FormTextField";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MAX_DOCUMENT_PHOTOS, type RegisterValues } from "@/features/auth/schemas";
import { BUSINESS_TYPE_LABELS, BUSINESS_TYPES } from "@/features/company/business-types";
import { getPanFromGstin, getStateFromGstin, isValidGstin } from "@/lib/gst";

/**
 * GSTINs and PANs are upper case without spaces; accept them however they are typed or pasted.
 * (No maxLength on the inputs: it would cut a pasted "29AAKFS 4821M1Z3" before the space goes.)
 */
const toUpperCompact = (length: number) => (value: string) =>
  value.toUpperCase().replace(/\s/g, "").slice(0, length);

export function BusinessStep() {
  const { control, setValue } = useFormContext<RegisterValues>();
  const gstin = useWatch({ control, name: "gstin" });
  const hasValidGstin = isValidGstin(gstin);

  function fillPanFromGstin(value: string) {
    if (isValidGstin(value)) setValue("pan", getPanFromGstin(value), { shouldValidate: true });
  }

  return (
    <>
      <FormTextField
        control={control}
        name="businessName"
        label="Business name"
        autoComplete="organization"
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
        label="GSTIN (optional)"
        autoCapitalize="characters"
        spellCheck={false}
        normalize={toUpperCompact(15)}
        onValueChange={fillPanFromGstin}
        description={
          hasValidGstin
            ? `Registered in ${getStateFromGstin(gstin)}. We've filled in your PAN below.`
            : "15 characters, e.g. 29AAKFS4821M1Z3. Needed for GST invoices with input credit."
        }
      />
      <FormTextField
        control={control}
        name="pan"
        label="PAN (optional)"
        autoCapitalize="characters"
        spellCheck={false}
        normalize={toUpperCompact(10)}
        readOnly={hasValidGstin}
        description={hasValidGstin ? "Taken from your GSTIN." : "10 characters, e.g. AAKFS4821M."}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormTextField
          control={control}
          name="licenceNumber"
          label="Shop or trade licence no. (optional)"
        />
        <FormTextField
          control={control}
          name="otherRegistration"
          label="Other registration (optional)"
          placeholder="e.g. Udyam number"
        />
      </div>
      <Controller
        control={control}
        name="documents"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="register-documents">
              Licence or certificate photos (optional)
            </FieldLabel>
            <FieldDescription id="register-documents-description">
              Photos of your GST certificate, licence or registration help us verify you faster.
            </FieldDescription>
            <PhotoUpload
              id="register-documents"
              value={field.value}
              onChange={field.onChange}
              max={MAX_DOCUMENT_PHOTOS}
              label="Document photo"
              isInvalid={fieldState.invalid}
              describedBy="register-documents-description"
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </>
  );
}
