import type { JobCardFilters, JobStatus } from "@/features/job-cards/types";
import {
  ACTIVE_JOB_STATUSES,
  JOB_STATUS_GROUPS,
  type JobStatusGroup,
} from "@/features/job-cards/utils";
import { getParam, parsePage, type RawSearchParams } from "@/lib/search-params";

/** The tabs on the job card list: every open job, a group by next step, or a final status. */
export const JOB_TABS: { value: string | null; label: string }[] = [
  { value: null, label: "Open" },
  ...Object.entries(JOB_STATUS_GROUPS).map(([value, group]) => ({ value, label: group.label })),
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Rejected" },
];

export function statusesFor(tab: string | null | undefined): JobStatus[] {
  if (!tab) return ACTIVE_JOB_STATUSES;
  if (tab in JOB_STATUS_GROUPS) return JOB_STATUS_GROUPS[tab as JobStatusGroup].statuses;
  if (tab === "completed" || tab === "closed") return [tab];
  return ACTIVE_JOB_STATUSES;
}

/**
 * The job list keeps its state in the URL:
 *   status   a tab (see JOB_TABS)     branch      branch id (owners only)
 *   tech     technician user id       q           job no., plate or customer
 *   page
 * Open work comes most urgent first (due soonest); finished jobs newest first.
 */
export function parseJobParams(raw: RawSearchParams): JobCardFilters {
  const tab = getParam(raw, "status");
  const isFinished = tab === "completed" || tab === "closed";
  return {
    statuses: statusesFor(tab),
    branchId: getParam(raw, "branch"),
    technicianId: getParam(raw, "tech"),
    q: getParam(raw, "q"),
    sort: isFinished ? "createdAt" : "dueAt",
    order: isFinished ? "desc" : "asc",
    page: parsePage(raw),
  };
}
