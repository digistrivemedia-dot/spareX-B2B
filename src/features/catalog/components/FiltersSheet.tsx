"use client";

import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CatalogFilters } from "@/features/catalog/components/CatalogFilters";
import { CATALOG_FILTER_KEYS } from "@/features/catalog/search-params";
import type { CatalogFilterOptions } from "@/features/catalog/types";
import { formatCount } from "@/lib/format";

type FiltersSheetProps = {
  options: CatalogFilterOptions;
  total: number;
};

/** The filters panel for screens too narrow to show it beside the results. */
export function FiltersSheet({ options, total }: FiltersSheetProps) {
  const searchParams = useSearchParams();
  const activeCount = CATALOG_FILTER_KEYS.filter((key) => searchParams.has(key)).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal aria-hidden />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-navy-700 px-1.5 text-xs font-semibold text-white tabular-nums">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="gap-0 data-[side=left]:w-full data-[side=left]:sm:max-w-sm"
      >
        <SheetHeader className="border-b border-gray-200 px-5 py-4">
          <SheetTitle className="text-base font-semibold text-gray-900">Filters</SheetTitle>
          <SheetDescription>Results update as you choose.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <CatalogFilters options={options} />
        </div>
        <SheetFooter className="border-t border-gray-200 px-5 py-4">
          <SheetClose asChild>
            <Button size="lg">Show {formatCount(total, "part")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
