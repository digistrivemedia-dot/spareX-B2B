import { Skeleton } from "@/components/ui/skeleton";

export default function OrderPlacedLoading() {
  return (
    <Skeleton
      aria-busy="true"
      aria-label="Loading your order"
      className="mx-auto h-96 max-w-2xl rounded-xl"
    />
  );
}
