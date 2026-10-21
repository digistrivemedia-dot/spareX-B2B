import { StatusBadge } from "@/components/ui/StatusBadge";
import type { LineCheck } from "@/features/quick-order/types";

/** The row's status badge with its reason, e.g. "Limited stock · Only 8 bottles at your delivery branch". */
export function LineStatusNote({ check }: { check: LineCheck }) {
  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <StatusBadge status={check.status} />
      {check.message && <span className="text-xs text-gray-600">{check.message}</span>}
    </span>
  );
}
