import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DetailItem, DetailList } from "@/components/ui/DetailList";
import { SectionCard } from "@/components/ui/SectionCard";
import { NotYet } from "@/features/job-cards/components/detail/JobSections";
import type { JobCard } from "@/features/job-cards/types";
import { JOB_FLOW } from "@/features/job-cards/utils";
import { formatDateTime, formatNumber, formatPrice } from "@/lib/format";

type BillingSectionProps = {
  job: JobCard;
  /** The invoice page is for whoever bills customers. */
  canBill: boolean;
};

/** The garage's invoice, the payment and the handover, with the invoice and report to open. */
export function BillingSection({ job, canBill }: BillingSectionProps) {
  const { invoice, payment, handover } = job;
  const hasReport = JOB_FLOW.indexOf(job.status) >= JOB_FLOW.indexOf("ready");
  return (
    <SectionCard title="Billing and handover">
      {invoice ? (
        <DetailList>
          <DetailItem label="Invoice">
            {invoice.number} · {formatPrice(invoice.totalInPaise)} incl. GST ·{" "}
            {formatDateTime(invoice.issuedAt)}
          </DetailItem>
          <DetailItem label="Payment">
            {payment
              ? `${formatPrice(payment.amountInPaise)} ${payment.method === "cash" ? "in cash" : "online"}, ${formatDateTime(payment.receivedAt)}`
              : "Not paid yet"}
          </DetailItem>
          <DetailItem label="Handover">
            {handover
              ? `${formatDateTime(handover.at)} by ${handover.by.name} · ${formatNumber(handover.odometerKm)} km`
              : "Not handed over yet"}
          </DetailItem>
        </DetailList>
      ) : (
        <NotYet>The invoice is made once the vehicle passes its quality check.</NotYet>
      )}
      {(hasReport || (invoice && canBill)) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {invoice && canBill && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/garage/jobs/${job.id}/invoice`}>View invoice</Link>
            </Button>
          )}
          {hasReport && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/garage/jobs/${job.id}/report`}>Completion report</Link>
            </Button>
          )}
        </div>
      )}
    </SectionCard>
  );
}
