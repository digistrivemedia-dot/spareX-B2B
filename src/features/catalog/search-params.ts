import type { CatalogFilters } from "@/features/catalog/types";

/**
 * The catalogue's state lives in its URL, so any view can be bookmarked or shared:
 *   q        search text            category  category id
 *   brand    brands, comma-separated make      bike make, e.g. "KTM"
 *   bike     bike model id          stock     only parts in stock at this branch id
 *   sort     "name" | "price"       order     "asc" | "desc"
 *   page     page number            view      "grid" (table when absent)
 *   product  id of the part shown in the detail drawer
 */

export type CatalogView = "table" | "grid";

/** The URL keys that narrow the results (shown as a count on the mobile "Filters" button). */
export const CATALOG_FILTER_KEYS = ["category", "brand", "make", "bike", "stock"] as const;

type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseCatalogParams(raw: RawSearchParams) {
  const get = (key: string) => {
    const value = raw[key];
    return (Array.isArray(value) ? value[0] : value) || undefined;
  };
  const sort = get("sort");
  const page = Number(get("page"));

  const filters: CatalogFilters = {
    q: get("q"),
    categoryId: get("category"),
    brands: get("brand")?.split(","),
    bikeBrand: get("make"),
    bikeId: get("bike"),
    inStockAtBranchId: get("stock"),
    sort: sort === "price" || sort === "name" ? sort : undefined,
    order: get("order") === "desc" ? "desc" : "asc",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
  const view: CatalogView = get("view") === "grid" ? "grid" : "table";

  return { filters, view, productId: get("product") };
}
