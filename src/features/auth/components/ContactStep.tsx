"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { FormTextField } from "@/components/ui/FormTextField";
import type { RegisterValues } from "@/features/auth/schemas";
import { lookupPincode } from "@/features/company/api";

type PinLookup = "idle" | "searching" | "found" | "not_found";

const PIN_DESCRIPTIONS: Record<PinLookup, string> = {
  idle: "We'll fill in the city and state.",
  searching: "Looking up your PIN code…",
  found: "City and state filled in. Change them if they're wrong.",
  not_found: "We couldn't find this PIN code. Please type your city and state.",
};

// No maxLength on these inputs: it would cut pasted text like "+91 98860 44120" before the
// spaces and prefix are stripped. The normalisers below cap the length instead.

/** "+91 98860 44120", "098860 44120" or "9886044120" → "9886044120" */
const toMobileDigits = (value: string) =>
  value
    .replace(/\D/g, "")
    .replace(/^(91|0)(?=\d{10}$)/, "")
    .slice(0, 10);

const toPinDigits = (value: string) => value.replace(/\D/g, "").slice(0, 6);

export function ContactStep() {
  const { control, setValue } = useFormContext<RegisterValues>();
  const [pinLookup, setPinLookup] = useState<PinLookup>("idle");

  async function fillCityFromPin(pin: string) {
    if (pin.length !== 6) return setPinLookup("idle");
    setPinLookup("searching");
    const details = await lookupPincode(pin);
    if (!details) return setPinLookup("not_found");
    setValue("city", details.city, { shouldValidate: true });
    setValue("state", details.state, { shouldValidate: true });
    setPinLookup("found");
  }

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
        onValueChange={fillCityFromPin}
        description={PIN_DESCRIPTIONS[pinLookup]}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormTextField control={control} name="city" label="City" autoComplete="address-level2" />
        <FormTextField control={control} name="state" label="State" autoComplete="address-level1" />
      </div>
    </>
  );
}
