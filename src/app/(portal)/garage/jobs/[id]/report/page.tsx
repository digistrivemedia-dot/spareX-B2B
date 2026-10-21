import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/ui/PrintButton";
import { CompletionReport } from "@/features/job-cards/components/CompletionReport";
import { JobStepUnavailable } from "@/features/job-cards/components/JobStepUnavailable";
import { loadJobForPage } from "@/features/job-cards/load-job";
import { JOB_FLOW } from "@/features/job-cards/utils";

export const metadata: Metadata = {
  title: "Completion report",
};

type ReportPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompletionReportPage({ params }: ReportPageProps) {
  const { job, session } = await loadJobForPage((await params).id, "jobs:view");
  // The report exists once the vehicle has passed its quality check.
  const isReady = JOB_FLOW.indexOf(job.status) >= JOB_FLOW.indexOf("ready");

  return (
    <>
      <PageHeader
        title={`Completion report: ${job.vehicle.plate}`}
        description={`${job.vehicle.make} ${job.vehicle.model} · ${job.number}`}
        actions={isReady && <PrintButton label="Print or save for the customer" />}
      />
      {isReady ? (
        <div className="flex max-w-3xl flex-col gap-4">
          <CompletionReport job={job} business={session.business} />
          <Button variant="ghost" className="self-start print:hidden" asChild>
            <Link href={`/garage/jobs/${job.id}`}>Back to job card</Link>
          </Button>
        </div>
      ) : (
        <JobStepUnavailable
          jobId={job.id}
          title="Not finished yet"
          description="The completion report is ready once the vehicle passes its quality check."
        />
      )}
    </>
  );
}
