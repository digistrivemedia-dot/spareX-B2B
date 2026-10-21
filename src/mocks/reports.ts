import type { JobCard } from "@/features/job-cards/types";
import {
  ACTIVE_JOB_STATUSES,
  approvedLines,
  TECHNICIAN_STATUSES,
} from "@/features/job-cards/utils";
import type { BranchReport, ReportFilters } from "@/features/reports/types";
import { toIndiaDate } from "@/lib/dates";
import { companyUsers } from "@/mocks/company";
import { jobCards } from "@/mocks/job-cards";
import { simulateLatency } from "@/mocks/utils";

const TOP_SERVICES = 5;

/** When the job was paid for, which is when its revenue counts. */
const paidOn = (job: JobCard) => job.payment && toIndiaDate(job.payment.receivedAt);

export async function getBranchReportMock({
  branchId,
  from,
  to,
}: ReportFilters): Promise<BranchReport> {
  await simulateLatency();
  const inBranch = jobCards.filter((job) => !branchId || job.branch.id === branchId);
  const paid = inBranch.filter((job) => {
    const day = paidOn(job);
    return day !== undefined && day >= from && day <= to;
  });
  const completed = paid.filter((job) => job.status === "completed");
  const revenueInPaise = paid.reduce((sum, job) => sum + (job.payment?.amountInPaise ?? 0), 0);

  const services = new Map<string, { count: number; revenueInPaise: number }>();
  for (const job of paid) {
    for (const line of approvedLines(job.estimate?.lines ?? [])) {
      if (line.kind !== "service" && line.kind !== "labour") continue;
      const entry = services.get(line.description) ?? { count: 0, revenueInPaise: 0 };
      services.set(line.description, {
        count: entry.count + line.quantity,
        revenueInPaise: entry.revenueInPaise + line.unitPriceInPaise * line.quantity,
      });
    }
  }

  const technicians = companyUsers
    .filter(
      (user) => user.roles.includes("technician") && (!branchId || user.branchId === branchId),
    )
    .map((user) => ({
      id: user.id,
      name: user.name,
      completed: completed.filter((job) => job.technician?.id === user.id).length,
      active: inBranch.filter(
        (job) => job.technician?.id === user.id && TECHNICIAN_STATUSES.includes(job.status),
      ).length,
    }));

  return {
    jobsCompleted: completed.length,
    revenueInPaise,
    averageJobValueInPaise: paid.length ? Math.round(revenueInPaise / paid.length) : 0,
    openByStatus: ACTIVE_JOB_STATUSES.map((status) => ({
      status,
      count: inBranch.filter((job) => job.status === status).length,
    })).filter((row) => row.count > 0),
    technicians,
    topServices: [...services]
      .map(([name, totals]) => ({ name, ...totals }))
      .sort((a, b) => b.count - a.count || b.revenueInPaise - a.revenueInPaise)
      .slice(0, TOP_SERVICES),
  };
}
