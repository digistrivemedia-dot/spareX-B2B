import { DataTableSkeleton } from "@/components/ui/data-table/DataTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReturnsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading returns">
      <div className="mb-6 flex flex-col gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <DataTableSkeleton columns={7} rows={3} />
    </div>
  );
}
