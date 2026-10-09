import { DataTableSkeleton } from "@/components/ui/data-table/DataTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-label="Loading your dashboard">
      <div className="mb-6 flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="mb-6 h-12 rounded-xl" />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="mb-3 h-6 w-40" />
      <div className="mb-8">
        <DataTableSkeleton columns={7} rows={5} />
      </div>
      <Skeleton className="mb-8 h-56 rounded-xl" />
      <Skeleton className="mb-3 h-6 w-40" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
