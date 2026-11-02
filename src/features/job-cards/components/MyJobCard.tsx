import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { NumberPlate } from "@/components/ui/NumberPlate";
import { MyJobResponse } from "@/features/job-cards/components/MyJobResponse";
import type { JobCardSummary } from "@/features/job-cards/types";
import { isPast } from "@/lib/dates";
import { formatWhen } from "@/lib/format";
import { cn } from "@/lib/utils";

/** What the technician is told about the job, in plain words rather than a status. */
function progressText(job: JobCardSummary): string {
  if (job.status === "job_card_created" || job.status === "inspection") return "Inspection to do";
  if (job.status === "quality_check") return "With quality check";
  if (job.status === "awaiting_approval") return "Customer is approving extra work";
  if (job.tasks) return `${job.tasks.done} of ${job.tasks.total} tasks done`;
  return "Tasks on the job";
}

/** A job in the technician's list, with the one thing they can do about it. */
export function MyJobCard({ job }: { job: JobCardSummary }) {
  const isLate = job.promisedAt !== undefined && isPast(job.promisedAt);
  const isWaiting = job.status === "quality_check" || job.status === "awaiting_approval";

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <NumberPlate plate={job.vehicle.plate} />
        <span className="text-base font-semibold text-gray-900">
          {job.vehicle.make} {job.vehicle.model}
        </span>
        <span className="text-sm text-gray-700">{progressText(job)}</span>
        {job.promisedAt && (
          <span
            className={cn(
              "text-sm tabular-nums",
              isLate ? "font-semibold text-danger-700" : "text-gray-500",
            )}
          >
            {isLate ? "Late · was due " : "Due "}
            {formatWhen(job.promisedAt)}
          </span>
        )}
      </div>
      {job.status === "approved" ? (
        <MyJobResponse jobId={job.id} />
      ) : job.status === "job_card_created" || job.status === "inspection" ? (
        <Button size="lg" asChild>
          <Link href={`/garage/jobs/${job.id}/inspection`}>
            Inspect vehicle
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      ) : (
        <Button size="lg" variant={isWaiting ? "outline" : "default"} asChild>
          <Link href={`/garage/my-jobs/${job.id}`}>
            {isWaiting ? "View job" : "Continue"}
            {!isWaiting && <ArrowRight aria-hidden />}
          </Link>
        </Button>
      )}
    </li>
  );
}
