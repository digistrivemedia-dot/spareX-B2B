import type { CatalogFilterOptions, CatalogFilters, Product } from "@/features/catalog/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import {
  getCatalogFilterOptionsMock,
  getCatalogMock,
  getFrequentlyOrderedMock,
  getProductMock,
  getProductsByIdMock,
  getProductsByPartNumberMock,
} from "@/mocks/catalog";

export async function getCatalog(filters: CatalogFilters = {}): Promise<Paginated<Product>> {
  if (dataSource.catalog === "mock") return getCatalogMock(filters);
  const { brands, ...params } = filters;
  return apiClient<Paginated<Product>>("/catalog/products", {
    query: { ...params, brands: brands?.join(",") },
  });
}

/** One product, or null if it doesn't exist. */
export async function getProduct(id: string): Promise<Product | null> {
  if (dataSource.catalog === "mock") return getProductMock(id);
  return apiClient<Product | null>(`/catalog/products/${id}`);
}

/** Several products at once, e.g. everything in the cart. Unknown ids are left out. */
export async function getProductsById(ids: string[]): Promise<Product[]> {
  if (dataSource.catalog === "mock") return getProductsByIdMock(ids);
  return apiClient<Product[]>("/catalog/products", { query: { ids: ids.join(",") } });
}

/** The products with these part numbers (case, spaces and dashes don't matter). */
export async function getProductsByPartNumber(partNumbers: string[]): Promise<Product[]> {
  if (dataSource.catalog === "mock") return getProductsByPartNumberMock(partNumbers);
  return apiClient<Product[]>("/catalog/products/lookup", {
    method: "POST",
    body: { partNumbers },
  });
}

export async function getCatalogFilterOptions(): Promise<CatalogFilterOptions> {
  if (dataSource.catalog === "mock") return getCatalogFilterOptionsMock();
  return apiClient<CatalogFilterOptions>("/catalog/filters");
}

/** The parts this business reorders most often. */
export async function getFrequentlyOrdered(): Promise<Product[]> {
  if (dataSource.catalog === "mock") return getFrequentlyOrderedMock();
  return apiClient<Product[]>("/catalog/frequently-ordered");
}
