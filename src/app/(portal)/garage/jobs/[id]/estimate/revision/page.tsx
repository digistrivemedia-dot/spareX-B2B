import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { getGarageProfile } from "@/features/garage/api";
import { EstimateLinesTable } from "@/features/job-cards/components/detail/EstimateLinesTable";
import { EstimateBuilder } from "@/features/job-cards/components/EstimateBuilder";
import { JobStepUnavailable } from "@/features/job-cards/components/JobStepUnavailable";
import { loadJobForPage } from "@/features/job-cards/load-job";
import { approvedLines } from "@/features/job-cards/utils";

export const metadata: Metadata = {
  title: "Extra work",
};

type RevisionPageProps = {
  params: Promise<{ id: string }>;
};

/** Extra work found during the service goes back to the customer for approval. */
export default async function RevisionPage({ params }: RevisionPageProps) {
  const { job } = await loadJobForPage((await params).id, "jobs:manage");
  const canRevise = (job.status === "approved" || job.status === "in_progress") && job.estimate;
  const extraReport = job.progress.findLast((note) => note.isExtraWork);

  return (
    <>
      <PageHeader
        title={`Extra work on ${job.vehicle.plate}`}
        description={`${job.vehicle.make} ${job.vehicle.model} · ${job.customer.name} · ${job.number}`}
      />
      {canRevise && job.estimate ? (
        <div className="flex flex-col gap-6">
          {extraReport && (
            <p className="rounded-lg border border-warning-500 bg-warning-50 p-3 text-sm text-gray-900">
              <strong>{extraReport.by.name} found:</strong> {extraReport.text}
            </p>
          )}
          <SectionCard title="Already approved">
            <EstimateLinesTable lines={approvedLines(job.estimate.lines)} />
          </SectionCard>
          <EstimateBuilder
            job={job}
            services={(await getGarageProfile()).services}
            mode="revision"
          />
        </div>
      ) : (
        <JobStepUnavailable
          jobId={job.id}
          title="Extra work can't be added now"
          description="Extra work is added while the job is approved or in progress."
        />
      )}
    </>
  );
}
