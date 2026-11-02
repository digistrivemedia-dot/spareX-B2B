import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { NumberPlate } from "@/components/ui/NumberPlate";
import { can } from "@/features/auth/permissions";
import type { Role } from "@/features/auth/types";
import { StageBadge } from "@/features/job-cards/components/StageBadge";
import type { JobCardSummary } from "@/features/job-cards/types";
import { getNextAction, getStatusGroup, getWaitingNote } from "@/features/job-cards/utils";
import { isPast } from "@/lib/dates";
import { formatPrice, formatWhen } from "@/lib/format";
import { cn } from "@/lib/utils";

/** The one extra detail that matters at each stage; everything else is on the job card. */
function stageDetail(job: JobCardSummary): string | undefined {
  const group = getStatusGroup(job.status);
  // On the road: where the driver is going.
  if (job.status === "out_for_pickup") return job.pickupDrop?.pickupAddress;
  if (job.status === "out_for_delivery") return job.pickupDrop?.dropAddress;
  if (group === "arriving" && job.pickupDrop) {
    return job.scheduledAt && `Pick-up: ${formatWhen(job.scheduledAt)}`;
  }
  if (group === "arriving") {
    return job.scheduledAt && `Slot: ${formatWhen(job.scheduledAt)}`;
  }
  // Who is working on it is in the next-step column, so it isn't repeated here.
  if (group === "servicing") {
    if (job.status === "quality_check") return "In quality check";
    return job.status === "approved" ? "Not started yet" : undefined;
  }
  if (group && job.amountInPaise !== undefined && group !== "to_estimate") {
    return `${formatPrice(job.amountInPaise)} incl. GST`;
  }
  return undefined;
}

type JobQueueRowProps = {
  job: JobCardSummary;
  roles: readonly Role[];
  /** Owners looking at every branch see which branch each job is at. */
  showBranch: boolean;
};

/** One vehicle: what it is, where it stands, and the next step (or who it's waiting on). */
export function JobQueueRow({ job, roles, showBranch }: JobQueueRowProps) {
  const action = getNextAction(job);
  const next = action && can(roles, action.permission) ? action : undefined;
  const isOpen = job.status !== "completed" && job.status !== "closed";
  const isLate = isOpen && job.promisedAt !== undefined && isPast(job.promisedAt);
  const detail = stageDetail(job);

  return (
    <li className="relative flex flex-col gap-3 px-4 py-4 hover:bg-gray-50 md:flex-row md:items-center md:gap-6">
      <div className="flex min-w-0 flex-col gap-1 md:flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <NumberPlate plate={job.vehicle.plate} />
          {/* The row opens the job card; the next-step button sits above this link. */}
          <Link
            href={`/garage/jobs/${job.id}`}
            className="font-semibold text-gray-900 after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {job.vehicle.make} {job.vehicle.model}
          </Link>
        </span>
        <span className="truncate text-sm text-gray-500">
          {job.customer.name} · {job.number}
          {job.source === "walk_in" && " · Walk-in"}
          {showBranch && ` · ${job.branch.name}`}
        </span>
      </div>

      <div className="flex flex-col items-start gap-1 md:w-52 md:shrink-0">
        <StageBadge status={job.status} />
        {detail && <span className="line-clamp-2 text-sm text-gray-700">{detail}</span>}
      </div>

      <div className="flex flex-col items-start gap-1 md:w-64 md:shrink-0 md:items-end">
        {next ? (
          <Button size="sm" asChild className="relative z-10">
            <Link href={next.href}>
              {next.label}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        ) : (
          <span className="text-sm text-gray-500">{getWaitingNote(job)}</span>
        )}
        {isOpen && job.promisedAt && (
          <span
            className={cn(
              "text-sm tabular-nums md:text-right",
              isLate ? "font-semibold text-danger-700" : "text-gray-700",
            )}
          >
            {isLate ? "Late · " : "Due "}
            {formatWhen(job.promisedAt)}
          </span>
        )}
      </div>
    </li>
  );
}
