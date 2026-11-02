import { ClipboardList } from "lucide-react";

import { DataTablePagination } from "@/components/ui/data-table/DataTablePagination";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Role } from "@/features/auth/types";
import { JobQueueRow } from "@/features/job-cards/components/JobQueueRow";
import type { JobCardSummary } from "@/features/job-cards/types";
import type { Paginated } from "@/lib/types";

type JobQueueProps = {
  jobs: Paginated<JobCardSummary>;
  roles: readonly Role[];
  showBranch: boolean;
};

/**
 * The garage's work queue: one row per vehicle with its stage and next step. A to-do list rather
 * than the shared DataTable, because each row is something to act on, not a record to browse.
 */
export function JobQueue({ jobs, roles, showBranch }: JobQueueProps) {
  const { items, ...pagination } = jobs;

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <EmptyState
          icon={ClipboardList}
          title="Nothing here"
          description="No vehicles at this step. Try another tab, technician or search, or create a new job card."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul
        aria-label="Job cards"
        className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        {items.map((job) => (
          <JobQueueRow key={job.id} job={job} roles={roles} showBranch={showBranch} />
        ))}
      </ul>
      <DataTablePagination {...pagination} />
    </div>
  );
}
