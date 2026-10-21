import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { can } from "@/features/auth/permissions";
import { getJobCard } from "@/features/job-cards/api";
import { JobCardDetail } from "@/features/job-cards/components/JobCardDetail";
import { loadJobForPage } from "@/features/job-cards/load-job";

type JobCardPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: JobCardPageProps): Promise<Metadata> {
  const job = await getJobCard((await params).id);
  return { title: job ? `Job ${job.number}` : "Job card not found" };
}

export default async function JobCardPage({ params }: JobCardPageProps) {
  const { job, session } = await loadJobForPage((await params).id, "jobs:view");

  return (
    <>
      <PageHeader
        title={job.number}
        description={`${job.vehicle.plate} · ${job.vehicle.make} ${job.vehicle.model} · ${job.customer.name}`}
      />
      <JobCardDetail
        job={job}
        access={{
          canManage: can(session.roles, "jobs:manage"),
          canCheckQuality: can(session.roles, "jobs:qa"),
        }}
      />
    </>
  );
}
