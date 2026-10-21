import Link from "next/link";

import { Button } from "@/components/ui/button";
import { NumberPlate } from "@/components/ui/NumberPlate";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MyJobResponse } from "@/features/job-cards/components/MyJobResponse";
import type { JobCardSummary } from "@/features/job-cards/types";
import { formatDateTime } from "@/lib/format";

/** A job in the technician's list, with the one thing they can do about it. */
export function MyJobCard({ job }: { job: JobCardSummary }) {
  return (
    <li className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <NumberPlate plate={job.vehicle.plate} />
          <span className="text-base font-semibold text-gray-900">
            {job.vehicle.make} {job.vehicle.model}
          </span>
          <span className="text-sm text-gray-500">
            {job.number}
            {job.promisedAt && ` · promised ${formatDateTime(job.promisedAt)}`}
          </span>
        </div>
        <StatusBadge status={job.status} />
      </div>
      {job.status === "approved" ? (
        <MyJobResponse jobId={job.id} />
      ) : job.status === "job_card_created" ? (
        <Button size="lg" asChild>
          <Link href={`/garage/jobs/${job.id}/inspection`}>Inspect vehicle</Link>
        </Button>
      ) : (
        <Button size="lg" variant={job.status === "in_progress" ? "default" : "outline"} asChild>
          <Link href={`/garage/my-jobs/${job.id}`}>
            {job.status === "in_progress" ? "Open job" : "View job"}
          </Link>
        </Button>
      )}
    </li>
  );
}
