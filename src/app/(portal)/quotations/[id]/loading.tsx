import { DataTableSkeleton } from "@/components/ui/data-table/DataTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuotationLoading() {
  return (
    <div aria-busy="true" aria-label="Loading the quotation">
      <div className="mb-6 flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="flex-1">
          <DataTableSkeleton columns={6} rows={4} />
        </div>
        <Skeleton className="h-72 rounded-xl xl:w-80" />
      </div>
    </div>
  );
}
