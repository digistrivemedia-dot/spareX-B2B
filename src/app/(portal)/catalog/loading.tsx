import { DataTableSkeleton } from "@/components/ui/data-table/DataTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogLoading() {
  return (
    <div aria-busy="true" aria-label="Loading the catalogue">
      <div className="mb-6 flex flex-col gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="flex gap-6">
        <div className="hidden w-52 shrink-0 flex-col gap-3 xl:flex">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="h-6" />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <Skeleton className="mb-3 h-9" />
          <Skeleton className="mb-4 h-4 w-72" />
          <DataTableSkeleton columns={5} rows={8} />
        </div>
      </div>
    </div>
  );
}
