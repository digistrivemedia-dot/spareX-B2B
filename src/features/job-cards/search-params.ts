import type { JobCardFilters, JobStatus } from "@/features/job-cards/types";
import {
  ACTIVE_JOB_STATUSES,
  JOB_STATUS_GROUPS,
  type JobStatusGroup,
} from "@/features/job-cards/utils";
import { getParam, parsePage, type RawSearchParams } from "@/lib/search-params";

/** The tabs on the job card list: a status group, a single final status, or open jobs. */
export const JOB_TABS: { value: string | null; label: string }[] = [
  { value: null, label: "Open" },
  ...Object.entries(JOB_STATUS_GROUPS).map(([value, group]) => ({ value, label: group.label })),
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
];

function statusesFor(tab: string | undefined): JobStatus[] {
  if (!tab) return ACTIVE_JOB_STATUSES;
  if (tab in JOB_STATUS_GROUPS) return JOB_STATUS_GROUPS[tab as JobStatusGroup].statuses;
  if (tab === "completed" || tab === "closed") return [tab];
  return ACTIVE_JOB_STATUSES;
}

/**
 * The job list keeps its state in the URL:
 *   status   a tab (see JOB_TABS)     branch      branch id (owners only)
 *   tech     technician user id       q           job no., plate or customer
 *   order    "asc" | "desc"           page
 */
export function parseJobParams(raw: RawSearchParams): JobCardFilters {
  return {
    statuses: statusesFor(getParam(raw, "status")),
    branchId: getParam(raw, "branch"),
    technicianId: getParam(raw, "tech"),
    q: getParam(raw, "q"),
    order: getParam(raw, "order") === "asc" ? "asc" : "desc",
    page: parsePage(raw),
  };
}
