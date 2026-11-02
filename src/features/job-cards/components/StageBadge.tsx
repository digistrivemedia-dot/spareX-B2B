import { StatusBadge } from "@/components/ui/StatusBadge";
import type { JobStatus } from "@/features/job-cards/types";
import { getStatusGroup, JOB_STATUS_GROUPS, type JobStatusGroup } from "@/features/job-cards/utils";

/** Each stage takes the colour of the status that best describes it. */
const STAGE_TONES: Record<JobStatusGroup, JobStatus> = {
  arriving: "confirmed",
  on_the_road: "out_for_delivery",
  to_estimate: "vehicle_received",
  awaiting_approval: "awaiting_approval",
  servicing: "in_progress",
  ready: "ready",
  payment_pending: "payment_pending",
  paid: "paid",
};

/**
 * A job's stage in the same words as the job card tabs ("Servicing", "To bill"), so lists never
 * show the thirteen detailed statuses.
 */
export function StageBadge({ status, className }: { status: JobStatus; className?: string }) {
  const group = getStatusGroup(status);
  if (!group) {
    return (
      <StatusBadge status={status} className={className}>
        {status === "closed" ? "Rejected" : undefined}
      </StatusBadge>
    );
  }
  return (
    <StatusBadge status={STAGE_TONES[group]} className={className}>
      {JOB_STATUS_GROUPS[group].label}
    </StatusBadge>
  );
}
