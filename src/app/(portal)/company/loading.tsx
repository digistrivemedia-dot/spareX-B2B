import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyLoading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-48 rounded-xl" />
      ))}
    </div>
  );
}
