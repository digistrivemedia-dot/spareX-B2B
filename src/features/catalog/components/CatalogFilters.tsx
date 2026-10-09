"use client";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BikeFilter } from "@/features/catalog/components/BikeFilter";
import { FilterSection } from "@/features/catalog/components/FilterSection";
import { CATALOG_FILTER_KEYS } from "@/features/catalog/search-params";
import type { CatalogFilterOptions } from "@/features/catalog/types";
import { useSelectedBranch } from "@/features/company/use-selected-branch";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import { cn } from "@/lib/utils";

const CLEARED_FILTERS = Object.fromEntries(CATALOG_FILTER_KEYS.map((key) => [key, null]));

export function CatalogFilters({ options }: { options: CatalogFilterOptions }) {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const branch = useSelectedBranch();

  const category = searchParams.get("category");
  const brands = searchParams.get("brand")?.split(",") ?? [];
  const hasFilters = CATALOG_FILTER_KEYS.some((key) => searchParams.has(key));

  // Any filter change goes back to page 1.
  const setFilters = (updates: Record<string, string | null>) =>
    updateSearchParams({ ...updates, page: null });

  function toggleBrand(brand: string, checked: boolean) {
    const next = checked ? [...brands, brand] : brands.filter((b) => b !== brand);
    setFilters({ brand: next.join(",") || null });
  }

  return (
    <div className="flex flex-col gap-5">
      <FilterSection title="Category">
        <ul className="flex flex-col gap-0.5">
          {[{ id: null, name: "All categories" }, ...options.categories].map((option) => (
            <li key={option.id ?? "all"}>
              <button
                type="button"
                aria-pressed={category === option.id}
                onClick={() => setFilters({ category: option.id })}
                className={cn(
                  "w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  category === option.id ? "bg-navy-50 font-medium text-navy-800" : "text-gray-700",
                )}
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Brand">
        <div className="flex max-h-56 flex-col gap-2 overflow-y-auto">
          {options.brands.map((brand) => {
            const id = `filter-brand-${brand}`;
            return (
              <label
                key={brand}
                htmlFor={id}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <Checkbox
                  id={id}
                  checked={brands.includes(brand)}
                  onCheckedChange={(checked) => toggleBrand(brand, checked === true)}
                />
                {brand}
              </label>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Fits bike">
        <BikeFilter
          bikeModels={options.bikeModels}
          make={searchParams.get("make") ?? undefined}
          bikeId={searchParams.get("bike") ?? undefined}
          onChange={(make, bike) => setFilters({ make, bike })}
        />
      </FilterSection>

      {branch && (
        <FilterSection title="Availability">
          <label htmlFor="filter-stock" className="flex items-center gap-2 text-sm text-gray-700">
            <Checkbox
              id="filter-stock"
              checked={searchParams.has("stock")}
              onCheckedChange={(checked) =>
                setFilters({ stock: checked === true ? branch.id : null })
              }
            />
            In stock at {branch.name}
          </label>
        </FilterSection>
      )}

      {hasFilters && (
        <Button variant="outline" size="sm" onClick={() => setFilters(CLEARED_FILTERS)}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
