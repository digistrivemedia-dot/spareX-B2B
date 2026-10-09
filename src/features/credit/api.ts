import type { CreditSummary } from "@/features/credit/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { getCreditSummaryMock } from "@/mocks/credit";

export async function getCreditSummary(): Promise<CreditSummary> {
  if (dataSource.credit === "mock") return getCreditSummaryMock();
  return apiClient<CreditSummary>("/credit/summary");
}
