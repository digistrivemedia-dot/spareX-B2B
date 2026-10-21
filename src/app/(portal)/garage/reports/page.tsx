import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";
import { can, scopeToBranch } from "@/features/auth/permissions";
import { requirePermission } from "@/features/auth/session";
import { getBranches } from "@/features/company/api";
import { BranchFilter } from "@/features/garage/components/BranchFilter";
import { getBranchReport } from "@/features/reports/api";
import {
  OpenJobsByStatus,
  ReportStats,
  TechnicianWorkload,
  TopServices,
} from "@/features/reports/components/ReportSections";
import { indiaDateFromToday } from "@/lib/dates";
import { formatDate } from "@/lib/format";
import { getParam, parseDateRange, type RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Branch reports",
};

/** Without dates the report covers the last 30 days. */
const DEFAULT_DAYS = 30;

type ReportsPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const session = await requirePermission("reports:view", ["garage"]);
  const params = await searchParams;
  const branchId = scopeToBranch(session, getParam(params, "branch"));
  const range = parseDateRange(params);
  const to = range.to ?? indiaDateFromToday(0);
  const from = range.from ?? indiaDateFromToday(-DEFAULT_DAYS);
  const [report, branches] = await Promise.all([
    getBranchReport({ branchId, from, to }),
    getBranches(),
  ]);
  const branchName = branches.find((branch) => branch.id === branchId)?.name ?? "All branches";

  return (
    <>
      <PageHeader
        title="Branch reports"
        description={`${branchName} · ${formatDate(`${from}T12:00:00+05:30`)} to ${formatDate(`${to}T12:00:00+05:30`)}`}
      />
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end">
        <BranchFilter branches={branches} canChoose={can(session.roles, "garage:all_branches")} />
        <DateRangeFilter id="report" />
      </div>
      <div className="flex flex-col gap-6">
        <ReportStats report={report} />
        <div className="grid gap-6 lg:grid-cols-3">
          <TopServices rows={report.topServices} />
          <TechnicianWorkload rows={report.technicians} />
          <OpenJobsByStatus rows={report.openByStatus} />
        </div>
      </div>
    </>
  );
}
