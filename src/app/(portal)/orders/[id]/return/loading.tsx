import { Skeleton } from "@/components/ui/skeleton";

export default function ReturnFormLoading() {
  return (
    <div aria-busy="true" aria-label="Loading the return form">
      <div className="mb-6 flex flex-col gap-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <Skeleton className="h-48 rounded-xl xl:w-80" />
      </div>
    </div>
  );
}
