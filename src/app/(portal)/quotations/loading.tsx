import { DataTableSkeleton } from "@/components/ui/data-table/DataTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuotationsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading quotations">
      <div className="mb-6 flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="mb-4 h-10" />
      <DataTableSkeleton columns={6} rows={4} />
    </div>
  );
}
