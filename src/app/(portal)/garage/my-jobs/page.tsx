import { Wrench } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { requirePermission } from "@/features/auth/session";
import { getJobCards } from "@/features/job-cards/api";
import { MyJobCard } from "@/features/job-cards/components/MyJobCard";
import type { JobStatus } from "@/features/job-cards/types";

export const metadata: Metadata = {
  title: "My jobs",
};

/** What a technician works through, most urgent first. */
const MY_STATUSES: JobStatus[] = ["approved", "in_progress", "job_card_created", "quality_check"];

export default async function MyJobsPage() {
  const session = await requirePermission("jobs:work", ["garage"]);
  const jobs = await getJobCards({
    technicianId: session.user.id,
    statuses: MY_STATUSES,
    order: "asc",
    pageSize: 50,
  });
  const sorted = [...jobs.items].sort(
    (a, b) => MY_STATUSES.indexOf(a.status) - MY_STATUSES.indexOf(b.status),
  );

  return (
    <>
      <PageHeader
        title="My jobs"
        description="Jobs assigned to you. Accept new ones, then work through the tasks."
      />
      {sorted.length ? (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((job) => (
            <MyJobCard key={job.id} job={job} />
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={Wrench}
            title="No jobs assigned to you"
            description="When your manager assigns you a job, it appears here for you to accept."
          />
        </div>
      )}
    </>
  );
}
