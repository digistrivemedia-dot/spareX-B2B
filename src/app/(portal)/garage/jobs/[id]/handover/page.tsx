import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { HandoverForm } from "@/features/job-cards/components/HandoverForm";
import { JobStepUnavailable } from "@/features/job-cards/components/JobStepUnavailable";
import { can } from "@/features/auth/permissions";
import { loadJobForPage } from "@/features/job-cards/load-job";

export const metadata: Metadata = {
  title: "Handover",
};

type HandoverPageProps = {
  params: Promise<{ id: string }>;
};

export default async function HandoverPage({ params }: HandoverPageProps) {
  // The delivery driver hands the vehicle over here, at the customer's door.
  const { job, session } = await loadJobForPage((await params).id, "jobs:deliver", "drop");
  const isDelivery = job.status === "out_for_delivery";
  const doneHref = can(session.roles, "jobs:view")
    ? `/garage/jobs/${job.id}/report`
    : "/garage/my-trips";

  return (
    <>
      <PageHeader
        title={isDelivery ? `Deliver ${job.vehicle.plate}` : `Hand over ${job.vehicle.plate}`}
        description={
          isDelivery
            ? `${job.customer.name} · ${job.pickupDrop?.dropAddress}`
            : `${job.vehicle.make} ${job.vehicle.model} · ${job.customer.name} · ${job.number}`
        }
      />
      {(job.status === "paid" && !job.pickupDrop) || isDelivery ? (
        <HandoverForm job={job} doneHref={doneHref} />
      ) : (
        <JobStepUnavailable
          jobId={job.id}
          title={
            job.status === "completed"
              ? "Already handed over"
              : job.pickupDrop
                ? "Send it for delivery first"
                : "Collect the payment first"
          }
          description={
            job.status === "completed"
              ? "This job is complete. The completion report is on the job card."
              : job.pickupDrop
                ? "This customer asked for drop. Assign a driver from the job card."
                : "Vehicles are handed back once the invoice is paid."
          }
        />
      )}
    </>
  );
}
