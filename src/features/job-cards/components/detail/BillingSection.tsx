import { DetailItem, DetailList } from "@/components/ui/DetailList";
import { SectionCard } from "@/components/ui/SectionCard";
import { NotYet } from "@/features/job-cards/components/detail/JobSections";
import type { JobCard } from "@/features/job-cards/types";
import { formatDateTime, formatNumber, formatPrice } from "@/lib/format";

/** The garage's invoice, the payment and the handover. */
export function BillingSection({ job }: { job: JobCard }) {
  const { invoice, payment, handover } = job;
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
    </SectionCard>
  );
}
