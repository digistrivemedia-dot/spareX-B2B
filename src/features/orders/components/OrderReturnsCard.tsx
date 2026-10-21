import Link from "next/link";

import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ReturnSummary } from "@/features/returns/types";
import { formatCount, formatDate } from "@/lib/format";

/** Returns raised against this order, each linking to its progress. */
export function OrderReturnsCard({ returns }: { returns: ReturnSummary[] }) {
  return (
    <SectionCard title="Returns">
      <ul className="flex flex-col divide-y divide-gray-100 text-sm">
        {returns.map((request) => (
          <li
            key={request.id}
            className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
          >
            <span className="flex flex-col">
              <Link
                href={`/returns/${request.id}`}
                className="font-medium text-navy-700 hover:underline"
              >
                {request.number}
              </Link>
              <span className="text-xs text-gray-500">
                {formatCount(request.itemCount, "part")} · {formatDate(request.requestedAt)}
              </span>
            </span>
            <StatusBadge status={request.status} />
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
