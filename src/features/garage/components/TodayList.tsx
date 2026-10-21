import Link from "next/link";
import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { NumberPlate } from "@/components/ui/NumberPlate";
import { StatusBadge, type Status } from "@/components/ui/StatusBadge";
import type { LucideIcon } from "lucide-react";

export type TodayItem = {
  id: string;
  href: string;
  /** e.g. "10:30 am" or a job number. */
  lead: string;
  title: string;
  plate: string;
  status: Status;
  /** What to do next, when there is something. */
  action?: string;
};

type TodayListProps = {
  items: TodayItem[];
  empty: { icon: LucideIcon; title: string; description: string };
  footer?: ReactNode;
};

/** A short list of vehicles on the dashboard, each row opening its booking or job. */
export function TodayList({ items, empty, footer }: TodayListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <EmptyState icon={empty.icon} title={empty.title} description={empty.description} />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-sm hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none"
            >
              <span className="w-24 shrink-0 font-medium text-gray-900 tabular-nums">
                {item.lead}
              </span>
              <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
                <span className="truncate text-gray-900">{item.title}</span>
                <NumberPlate plate={item.plate} />
              </span>
              <span className="flex flex-col items-end gap-1">
                <StatusBadge status={item.status} />
                {item.action && (
                  <span className="text-xs font-medium text-navy-700">{item.action} →</span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {footer && <div className="border-t border-gray-100 px-4 py-2">{footer}</div>}
    </div>
  );
}
