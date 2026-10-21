import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { HandoverForm } from "@/features/job-cards/components/HandoverForm";
import { JobStepUnavailable } from "@/features/job-cards/components/JobStepUnavailable";
import { loadJobForPage } from "@/features/job-cards/load-job";

export const metadata: Metadata = {
  title: "Handover",
};

type HandoverPageProps = {
  params: Promise<{ id: string }>;
};

export default async function HandoverPage({ params }: HandoverPageProps) {
  const { job } = await loadJobForPage((await params).id, "jobs:billing");

  return (
    <>
      <PageHeader
        title={`Hand over ${job.vehicle.plate}`}
        description={`${job.vehicle.make} ${job.vehicle.model} · ${job.customer.name} · ${job.number}`}
      />
      {job.status === "paid" ? (
        <HandoverForm job={job} />
      ) : (
        <JobStepUnavailable
          jobId={job.id}
          title={job.status === "completed" ? "Already handed over" : "Collect the payment first"}
          description={
            job.status === "completed"
              ? "This job is complete. The completion report is on the job card."
              : "Vehicles are handed back once the invoice is paid."
          }
        />
      )}
    </>
  );
}
