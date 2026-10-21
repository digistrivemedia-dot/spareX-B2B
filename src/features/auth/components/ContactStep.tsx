"use client";

import { useFormContext } from "react-hook-form";

import { FormTextField } from "@/components/ui/FormTextField";
import type { RegisterValues } from "@/features/auth/schemas";
import { usePincodeLookup } from "@/features/company/use-pincode-lookup";
import { toMobileDigits, toPinDigits } from "@/lib/input-format";

export function ContactStep() {
  const { control, setValue } = useFormContext<RegisterValues>();
  const pinLookup = usePincodeLookup(({ city, state }) => {
    setValue("city", city, { shouldValidate: true });
    setValue("state", state, { shouldValidate: true });
  });

  return (
    <>
      <FormTextField
        control={control}
        name="contactName"
        label="Contact person (optional)"
        autoComplete="name"
        description="If someone other than you should hear from us about this account."
      />
      <FormTextField
        control={control}
        name="email"
        label="Business email"
        type="email"
        autoComplete="email"
        description="Your login details will be sent here once you're approved."
      />
      <FormTextField
        control={control}
        name="mobile"
        label="Mobile number"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        prefixText="+91"
        normalize={toMobileDigits}
      />
      <FormTextField
        control={control}
        name="addressLine1"
        label="Building and street"
        autoComplete="address-line1"
      />
      <FormTextField
        control={control}
        name="addressLine2"
        label="Area or landmark (optional)"
        autoComplete="address-line2"
      />
      <FormTextField
        control={control}
        name="pin"
        label="PIN code"
        inputMode="numeric"
        autoComplete="postal-code"
        normalize={toPinDigits}
        onValueChange={pinLookup.lookUp}
        description={pinLookup.description}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormTextField control={control} name="city" label="City" autoComplete="address-level2" />
        <FormTextField control={control} name="state" label="State" autoComplete="address-level1" />
      </div>
    </>
  );
}
