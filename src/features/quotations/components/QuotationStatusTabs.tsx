import Link from "next/link";

import type { QuotationStatus } from "@/features/quotations/types";
import { cn } from "@/lib/utils";

const TABS: { status?: QuotationStatus; label: string }[] = [
  { label: "All" },
  { status: "quoted", label: "Awaiting you" },
  { status: "requested", label: "Requested" },
  { status: "accepted", label: "Accepted" },
  { status: "rejected", label: "Rejected" },
  { status: "expired", label: "Expired" },
];

/** Status filter as links, so the URL holds it and each tab can be bookmarked. */
export function QuotationStatusTabs({ current }: { current?: QuotationStatus }) {
  return (
    <nav aria-label="Filter by status" className="mb-4 overflow-x-auto">
      <ul className="flex min-w-max gap-1 border-b border-gray-200">
        {TABS.map(({ status, label }) => {
          const isActive = status === current;
          return (
            <li key={label}>
              <Link
                href={status ? `/quotations?status=${status}` : "/quotations"}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "-mb-px inline-flex h-10 items-center border-b-2 px-3 text-sm font-medium whitespace-nowrap focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isActive
                    ? "border-navy-700 text-navy-800"
                    : "border-transparent text-gray-500 hover:text-gray-900",
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
