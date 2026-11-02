import { Wrench } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { requirePermission } from "@/features/auth/session";
import { getJobCards } from "@/features/job-cards/api";
import { MyJobCard } from "@/features/job-cards/components/MyJobCard";
import type { JobCardSummary, JobStatus } from "@/features/job-cards/types";

export const metadata: Metadata = {
  title: "My jobs",
};

/** The technician's jobs in three groups: to accept, to work on, and with someone else for now. */
const GROUPS: { title: string; statuses: JobStatus[] }[] = [
  { title: "New for you", statuses: ["approved"] },
  { title: "Working on", statuses: ["in_progress", "job_card_created", "inspection"] },
  { title: "Waiting", statuses: ["quality_check", "awaiting_approval"] },
];

export default async function MyJobsPage() {
  const session = await requirePermission("jobs:work", ["garage"]);
  const jobs = await getJobCards({
    technicianId: session.user.id,
    statuses: GROUPS.flatMap((group) => group.statuses),
    sort: "dueAt",
    order: "asc",
    pageSize: 50,
  });
  const groups = GROUPS.map((group) => ({
    ...group,
    jobs: jobs.items.filter((job: JobCardSummary) => group.statuses.includes(job.status)),
  })).filter((group) => group.jobs.length > 0);

  return (
    <>
      <PageHeader
        title="My jobs"
        description="Accept new jobs, then work through each one. Most urgent first."
      />
      {groups.length ? (
        <div className="flex flex-col gap-8">
          {groups.map((group) => (
            <section key={group.title} aria-label={group.title}>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                {group.title}{" "}
                <span className="text-gray-500 tabular-nums">({group.jobs.length})</span>
              </h2>
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.jobs.map((job) => (
                  <MyJobCard key={job.id} job={job} />
                ))}
              </ul>
            </section>
          ))}
        </div>
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
