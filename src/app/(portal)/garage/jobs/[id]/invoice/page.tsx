import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/ui/PrintButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getBranches } from "@/features/company/api";
import { CollectPaymentDialog } from "@/features/job-cards/components/CollectPaymentDialog";
import { CreateInvoiceButton } from "@/features/job-cards/components/CreateInvoiceButton";
import { GarageInvoiceDocument } from "@/features/job-cards/components/GarageInvoiceDocument";
import { JobStepUnavailable } from "@/features/job-cards/components/JobStepUnavailable";
import { loadJobForPage } from "@/features/job-cards/load-job";
import { approvedLines } from "@/features/job-cards/utils";

export const metadata: Metadata = {
  title: "Invoice",
};

type InvoicePageProps = {
  params: Promise<{ id: string }>;
};

/** Preview and raise the invoice, then collect the payment against it. */
export default async function InvoicePage({ params }: InvoicePageProps) {
  const { job, session } = await loadJobForPage((await params).id, "jobs:billing");
  const branch = (await getBranches()).find((candidate) => candidate.id === job.branch.id);
  const lines = approvedLines(job.estimate?.lines ?? []);
  const canBill = job.status === "ready" || Boolean(job.invoice);

  return (
    <>
      <PageHeader
        title={job.invoice ? `Invoice ${job.invoice.number}` : `Invoice for ${job.vehicle.plate}`}
        description={`${job.customer.name} · ${job.vehicle.make} ${job.vehicle.model} · ${job.number}`}
        actions={job.invoice && <PrintButton />}
      />
      {canBill ? (
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1">
            <GarageInvoiceDocument
              job={job}
              lines={lines}
              invoice={job.invoice}
              business={session.business}
              branch={branch}
            />
          </div>
          <aside className="flex flex-col gap-3 xl:sticky xl:top-20 xl:w-72 xl:shrink-0 print:hidden">
            <StatusBadge status={job.status} className="self-start" />
            {job.status === "ready" && <CreateInvoiceButton jobId={job.id} />}
            {job.status === "payment_pending" && job.invoice && (
              <CollectPaymentDialog jobId={job.id} amountInPaise={job.invoice.totalInPaise} />
            )}
            {job.status === "paid" && (
              <Button size="lg" asChild>
                <Link href={`/garage/jobs/${job.id}/handover`}>Hand over vehicle</Link>
              </Button>
            )}
            <Button variant="ghost" asChild>
              <Link href={`/garage/jobs/${job.id}`}>Back to job card</Link>
            </Button>
          </aside>
        </div>
      ) : (
        <JobStepUnavailable
          jobId={job.id}
          title="Not ready to bill"
          description="The invoice is made once the vehicle passes its quality check."
        />
      )}
    </>
  );
}
