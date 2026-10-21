import { ClipboardCheck, IndianRupee, Scale } from "lucide-react";
import Link from "next/link";

import { SectionCard } from "@/components/ui/SectionCard";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { BranchReport } from "@/features/reports/types";
import { formatPrice } from "@/lib/format";

export function ReportStats({ report }: { report: BranchReport }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Jobs completed"
        value={report.jobsCompleted}
        icon={ClipboardCheck}
        description="Handed back and paid in these dates"
      />
      <StatCard
        label="Revenue"
        value={formatPrice(report.revenueInPaise)}
        icon={IndianRupee}
        description="Payments received, incl. GST"
      />
      <StatCard
        label="Average job value"
        value={formatPrice(report.averageJobValueInPaise)}
        icon={Scale}
        description="Per paid job, incl. GST"
      />
    </div>
  );
}

/** Jobs open right now, by status; each opens the job list. */
export function OpenJobsByStatus({ rows }: { rows: BranchReport["openByStatus"] }) {
  return (
    <SectionCard title="Open jobs now">
      {rows.length ? (
        <ul className="flex flex-col divide-y divide-gray-100 text-sm">
          {rows.map(({ status, count }) => (
            <li
              key={status}
              className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
            >
              <StatusBadge status={status} />
              <span className="font-semibold text-gray-900 tabular-nums">{count}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No open jobs.</p>
      )}
      <Link
        href="/garage/jobs"
        className="mt-4 inline-block text-sm font-medium text-navy-700 hover:underline"
      >
        All open jobs
      </Link>
    </SectionCard>
  );
}

export function TechnicianWorkload({ rows }: { rows: BranchReport["technicians"] }) {
  return (
    <SectionCard title="Technician workload">
      {rows.length ? (
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500">
            <tr>
              <th className="pb-2 text-left font-medium">Technician</th>
              <th className="pb-2 text-right font-medium">Completed</th>
              <th className="pb-2 text-right font-medium">On now</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="py-2 text-gray-900">{row.name}</td>
                <td className="py-2 text-right font-semibold tabular-nums">{row.completed}</td>
                <td className="py-2 text-right tabular-nums">{row.active}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-sm text-gray-500">No technicians at this branch.</p>
      )}
    </SectionCard>
  );
}

export function TopServices({ rows }: { rows: BranchReport["topServices"] }) {
  return (
    <SectionCard title="Top services and labour">
      {rows.length ? (
        <ol className="flex flex-col divide-y divide-gray-100 text-sm">
          {rows.map((row, index) => (
            <li
              key={row.name}
              className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="w-5 shrink-0 text-gray-500 tabular-nums">{index + 1}.</span>
                <span className="text-gray-900">{row.name}</span>
              </span>
              <span className="text-right">
                <span className="block font-semibold text-gray-900 tabular-nums">
                  × {row.count}
                </span>
                <span className="text-xs text-gray-500 tabular-nums">
                  {formatPrice(row.revenueInPaise)} excl. GST
                </span>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-gray-500">No paid jobs in these dates.</p>
      )}
    </SectionCard>
  );
}
