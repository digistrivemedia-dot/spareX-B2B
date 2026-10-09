import type { QuotationFilters, QuotationSummary } from "@/features/quotations/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import { getQuotationsMock } from "@/mocks/quotations";

export async function getQuotations(
  filters: QuotationFilters = {},
): Promise<Paginated<QuotationSummary>> {
  if (dataSource.quotations === "mock") return getQuotationsMock(filters);
  return apiClient<Paginated<QuotationSummary>>("/quotations", { query: filters });
}
