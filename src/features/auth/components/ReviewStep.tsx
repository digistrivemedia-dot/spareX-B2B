"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { ReviewSection } from "@/features/auth/components/ReviewSection";
import type { RegisterValues } from "@/features/auth/schemas";
import { BUSINESS_TYPE_LABELS } from "@/features/company/business-types";
import { formatPhone } from "@/lib/format";
import { getStateFromGstin } from "@/lib/gst";

type ReviewStepProps = {
  onEditStep: (step: number) => void;
};

export function ReviewStep({ onEditStep }: ReviewStepProps) {
  const { control, getValues } = useFormContext<RegisterValues>();
  // The earlier steps are complete and can't change while this one is open.
  const values = getValues();
  const address = [values.addressLine1, values.addressLine2, values.city, values.state, values.pin]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <ReviewSection
        title="Business"
        onEdit={() => onEditStep(0)}
        rows={[
          { label: "Name", value: values.businessName },
          { label: "Type", value: BUSINESS_TYPE_LABELS[values.businessType] },
          { label: "GSTIN", value: values.gstin },
          { label: "PAN", value: values.pan },
          { label: "GST state", value: getStateFromGstin(values.gstin) ?? "" },
        ]}
      />
      <ReviewSection
        title="Contact"
        onEdit={() => onEditStep(1)}
        rows={[
          { label: "Name", value: values.contactName },
          { label: "Email", value: values.email },
          { label: "Mobile", value: formatPhone(values.mobile) },
          { label: "Address", value: address },
        ]}
      />
      <Controller
        control={control}
        name="acceptTerms"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-start gap-3">
              <Checkbox
                ref={field.ref}
                id="acceptTerms"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
                aria-invalid={fieldState.invalid}
                className="mt-0.5"
              />
              <FieldLabel
                htmlFor="acceptTerms"
                className="leading-normal font-normal text-gray-700"
              >
                I confirm these details are correct and agree to Kannali Garage&apos;s terms of
                trade for business customers.
              </FieldLabel>
            </div>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </>
  );
}
