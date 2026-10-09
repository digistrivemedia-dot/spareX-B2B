import { cache } from "react";

import type { Branch, PincodeDetails } from "@/features/company/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { getBranchesMock, lookupPincodeMock } from "@/mocks/company";

/** Cached per request: the top bar and the page both need the branches. */
export const getBranches = cache(async (): Promise<Branch[]> => {
  if (dataSource.company === "mock") return getBranchesMock();
  return apiClient<Branch[]>("/company/branches");
});

/** City and state for a PIN code, or null when it isn't recognised. */
export async function lookupPincode(pin: string): Promise<PincodeDetails | null> {
  if (dataSource.company === "mock") return lookupPincodeMock(pin);
  return apiClient<PincodeDetails | null>(`/pincodes/${pin}`);
}
