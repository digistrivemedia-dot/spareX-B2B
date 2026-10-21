"use client";

import { useState } from "react";

import { lookupPincode } from "@/features/company/api";
import type { PincodeDetails } from "@/features/company/types";

export type PinLookupState = "idle" | "searching" | "found" | "not_found";

export const PIN_LOOKUP_DESCRIPTIONS: Record<PinLookupState, string> = {
  idle: "We'll fill in the city and state.",
  searching: "Looking up your PIN code…",
  found: "City and state filled in. Change them if they're wrong.",
  not_found: "We couldn't find this PIN code. Please type the city and state.",
};

/** Looks up a PIN code once all 6 digits are in, and hands back the city and state. */
export function usePincodeLookup(onFound: (details: PincodeDetails) => void) {
  const [state, setState] = useState<PinLookupState>("idle");

  async function lookUp(pin: string) {
    if (pin.length !== 6) return setState("idle");
    setState("searching");
    const details = await lookupPincode(pin);
    if (!details) return setState("not_found");
    onFound(details);
    setState("found");
  }

  return { state, description: PIN_LOOKUP_DESCRIPTIONS[state], lookUp };
}
