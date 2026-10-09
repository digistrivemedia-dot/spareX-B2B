import { Skeleton } from "@/components/ui/skeleton";

type DataTableSkeletonProps = {
  columns: number;
  rows?: number;
};

/** Loading placeholder shaped like a DataTable, for `loading.tsx` files. */
export function DataTableSkeleton({ columns, rows = 5 }: DataTableSkeletonProps) {
  const cells = Array.from({ length: columns });

  return (
    <div aria-busy="true" aria-label="Loading" className="@container">
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white @3xl:block">
        <div className="flex h-10 items-center gap-6 border-b border-gray-200 bg-gray-50 px-4">
          {cells.map((_, cell) => (
            <Skeleton key={cell} className="h-3 flex-1" />
          ))}
        </div>
        {Array.from({ length: rows }, (_, row) => (
          <div
            key={row}
            className="flex h-12 items-center gap-6 border-b border-gray-100 px-4 last:border-0"
          >
            {cells.map((_, cell) => (
              <Skeleton key={cell} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
      <div className="grid gap-3 @xl:grid-cols-2 @3xl:hidden">
        {Array.from({ length: Math.min(rows, 3) }, (_, row) => (
          <Skeleton key={row} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
