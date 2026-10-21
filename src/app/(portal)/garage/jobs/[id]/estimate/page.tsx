import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { getGarageProfile } from "@/features/garage/api";
import { ApprovalForm } from "@/features/job-cards/components/ApprovalForm";
import { EstimateLinesTable } from "@/features/job-cards/components/detail/EstimateLinesTable";
import { EstimateBuilder } from "@/features/job-cards/components/EstimateBuilder";
import { JobStepUnavailable } from "@/features/job-cards/components/JobStepUnavailable";
import { loadJobForPage } from "@/features/job-cards/load-job";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Estimate",
};

type EstimatePageProps = {
  params: Promise<{ id: string }>;
};

/** Builds the first estimate after inspection, then records the customer's answer. */
export default async function EstimatePage({ params }: EstimatePageProps) {
  const { job } = await loadJobForPage((await params).id, "jobs:manage");
  const header = (
    <PageHeader
      title={`Estimate for ${job.vehicle.plate}`}
      description={`${job.vehicle.make} ${job.vehicle.model} · ${job.customer.name} · ${job.number}`}
    />
  );

  if (job.status === "inspection") {
    const { services } = await getGarageProfile();
    return (
      <>
        {header}
        <EstimateBuilder job={job} services={services} mode="first" />
      </>
    );
  }

  if (job.status === "awaiting_approval" && job.estimate) {
    return (
      <>
        {header}
        <div className="flex flex-col gap-6">
          <SectionCard title="Customer's answer">
            <ApprovalForm jobId={job.id} lines={job.estimate.lines} />
          </SectionCard>
          <SectionCard title="Whole estimate">
            <EstimateLinesTable lines={job.estimate.lines} />
            {job.estimate.sentAt && (
              <p className="mt-3 text-xs text-gray-500">
                Sent {formatDateTime(job.estimate.sentAt)}
              </p>
            )}
          </SectionCard>
        </div>
      </>
    );
  }

  return (
    <>
      {header}
      <JobStepUnavailable
        jobId={job.id}
        title={job.estimate ? "The customer has answered" : "Inspect the vehicle first"}
        description={
          job.estimate
            ? "The estimate is on the job card. Add extra work from there if more is found."
            : "The estimate is built from the inspection."
        }
      />
    </>
  );
}
