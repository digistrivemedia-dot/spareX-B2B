import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { JobStepUnavailable } from "@/features/job-cards/components/JobStepUnavailable";
import { QualityCheckForm } from "@/features/job-cards/components/QualityCheckForm";
import { loadJobForPage } from "@/features/job-cards/load-job";

export const metadata: Metadata = {
  title: "Quality check",
};

type QualityCheckPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QualityCheckPage({ params }: QualityCheckPageProps) {
  const { job } = await loadJobForPage((await params).id, "jobs:qa");

  return (
    <>
      <PageHeader
        title={`Quality check: ${job.vehicle.plate}`}
        description={`${job.vehicle.make} ${job.vehicle.model} · worked on by ${job.technician?.name ?? "the technician"} · ${job.number}`}
      />
      {job.status === "quality_check" ? (
        <QualityCheckForm job={job} />
      ) : (
        <JobStepUnavailable
          jobId={job.id}
          title="Not waiting for a quality check"
          description="The technician sends the vehicle for its check when the work is done."
        />
      )}
    </>
  );
}
