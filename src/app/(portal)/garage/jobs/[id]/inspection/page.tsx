import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { can } from "@/features/auth/permissions";
import { InspectionForm } from "@/features/job-cards/components/InspectionForm";
import { JobStepUnavailable } from "@/features/job-cards/components/JobStepUnavailable";
import { loadJobForPage } from "@/features/job-cards/load-job";

export const metadata: Metadata = {
  title: "Inspection",
};

type InspectionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function InspectionPage({ params }: InspectionPageProps) {
  const { job, session } = await loadJobForPage((await params).id, "jobs:inspect");
  const isOpen = job.status === "job_card_created" || job.status === "inspection";
  // Whoever builds estimates goes straight on to it; a technician goes back to the job.
  const nextHref = can(session.roles, "jobs:manage")
    ? `/garage/jobs/${job.id}/estimate`
    : `/garage/my-jobs/${job.id}`;

  return (
    <>
      <PageHeader
        title={`Inspect ${job.vehicle.plate}`}
        description={`${job.vehicle.make} ${job.vehicle.model} · complaints: ${job.complaints.join(", ")}`}
      />
      {isOpen ? (
        <InspectionForm job={job} nextHref={nextHref} />
      ) : (
        <JobStepUnavailable
          jobId={job.id}
          title="The inspection is closed"
          description="The estimate has gone to the customer, so the inspection can't change now."
        />
      )}
    </>
  );
}
