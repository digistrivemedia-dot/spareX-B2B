import type { Product } from "@/features/catalog/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { getFrequentlyOrderedMock } from "@/mocks/catalog";

/** The parts this business reorders most often. */
export async function getFrequentlyOrdered(): Promise<Product[]> {
  if (dataSource.catalog === "mock") return getFrequentlyOrderedMock();
  return apiClient<Product[]>("/catalog/frequently-ordered");
}
