import { DataTableSkeleton } from "@/components/ui/data-table/DataTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreditLoading() {
  return (
    <div aria-busy="true" aria-label="Loading your credit account">
      <div className="mb-6 flex flex-col gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="mb-3 h-6 w-48" />
      <DataTableSkeleton columns={6} rows={4} />
    </div>
  );
}
