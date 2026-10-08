import type { Branch } from "@/features/company/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { getBranchesMock } from "@/mocks/company";

export async function getBranches(): Promise<Branch[]> {
  if (dataSource.company === "mock") return getBranchesMock();
  return apiClient<Branch[]>("/company/branches");
}
