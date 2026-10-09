import { CatalogSearch } from "@/features/catalog/components/CatalogSearch";
import { FiltersSheet } from "@/features/catalog/components/FiltersSheet";
import { SortSelect } from "@/features/catalog/components/SortSelect";
import { ViewToggle } from "@/features/catalog/components/ViewToggle";
import type { CatalogView } from "@/features/catalog/search-params";
import type { CatalogFilterOptions } from "@/features/catalog/types";
import { formatCount } from "@/lib/format";

type CatalogToolbarProps = {
  options: CatalogFilterOptions;
  total: number;
  view: CatalogView;
};

export function CatalogToolbar({ options, total, view }: CatalogToolbarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex flex-col gap-3 @2xl:flex-row @2xl:items-center">
        <CatalogSearch />
        <div className="flex items-center gap-2">
          {/* The filters sit beside the results from xl up; below that they open in a sheet. */}
          <div className="xl:hidden">
            <FiltersSheet options={options} total={total} />
          </div>
          <SortSelect />
          <ViewToggle view={view} />
        </div>
      </div>
      <p role="status" className="text-sm text-gray-500">
        {formatCount(total, "part")} · business prices excl. GST · stock for your delivery branch
      </p>
    </div>
  );
}
