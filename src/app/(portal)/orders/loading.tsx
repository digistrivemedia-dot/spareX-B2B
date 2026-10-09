import { DataTableSkeleton } from "@/components/ui/data-table/DataTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <div aria-busy="true" aria-label="Loading orders">
      <div className="mb-6 flex flex-col gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="mb-4 h-16" />
      <DataTableSkeleton columns={8} rows={6} />
    </div>
  );
}
