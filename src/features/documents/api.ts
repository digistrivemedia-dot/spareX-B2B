import type { BusinessDocument, DocumentFilters } from "@/features/documents/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import { getDocumentsMock } from "@/mocks/documents";

export async function getDocuments(
  filters: DocumentFilters = {},
): Promise<Paginated<BusinessDocument>> {
  if (dataSource.documents === "mock") return getDocumentsMock(filters);
  return apiClient<Paginated<BusinessDocument>>("/documents", { query: filters });
}
