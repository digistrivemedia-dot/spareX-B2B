import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { scopeToBranch } from "@/features/auth/permissions";
import { requirePermission } from "@/features/auth/session";
import { getJobCard } from "@/features/job-cards/api";
import { JobCardDetail } from "@/features/job-cards/components/JobCardDetail";

type JobCardPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: JobCardPageProps): Promise<Metadata> {
  const job = await getJobCard((await params).id);
  return { title: job ? `Job ${job.number}` : "Job card not found" };
}

export default async function JobCardPage({ params }: JobCardPageProps) {
  const session = await requirePermission("jobs:view", ["garage"]);
  const job = await getJobCard((await params).id);
  const branchId = scopeToBranch(session);
  // Staff only see their own branch's jobs.
  if (!job || (branchId && job.branch.id !== branchId)) notFound();

  return (
    <>
      <PageHeader
        title={job.number}
        description={`${job.vehicle.plate} · ${job.vehicle.make} ${job.vehicle.model} · ${job.customer.name}`}
      />
      <JobCardDetail job={job} />
    </>
  );
}
