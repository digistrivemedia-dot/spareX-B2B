import { Clock } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Timeline } from "@/components/ui/Timeline";
import { AttachmentList } from "@/features/quotations/components/AttachmentList";
import { QuotationDecision } from "@/features/quotations/components/QuotationDecision";
import { QuotationLinesTable } from "@/features/quotations/components/QuotationLinesTable";
import { QuotationTotals } from "@/features/quotations/components/QuotationTotals";
import type { Quotation } from "@/features/quotations/types";
import { describeValidity, getQuotationSteps } from "@/features/quotations/utils";
import { cn } from "@/lib/utils";

export function QuotationDetail({ quotation }: { quotation: Quotation }) {
  const validity =
    quotation.status === "quoted" && quotation.validUntil
      ? describeValidity(quotation.validUntil)
      : null;

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <section>
          <SectionHeader title="Parts" />
          <div className="flex flex-col gap-4">
            <QuotationLinesTable lines={quotation.items} />
            {quotation.totalInPaise !== undefined && (
              <Card>
                <CardContent>
                  <QuotationTotals quotation={quotation} />
                </CardContent>
              </Card>
            )}
          </div>
        </section>
        {(quotation.kannaliNotes || quotation.customerNotes) && (
          <Section title="Notes">
            <dl className="flex flex-col gap-4 text-sm">
              {quotation.kannaliNotes && (
                <Note label="From Kannali" text={quotation.kannaliNotes} />
              )}
              {quotation.customerNotes && (
                <Note label="Your request" text={quotation.customerNotes} />
              )}
            </dl>
          </Section>
        )}
        <Section title="Attachments">
          <AttachmentList attachments={quotation.attachments} />
        </Section>
      </div>

      {/* Below xl the aside dissolves so its status card can lead the page and its history close it. */}
      <aside className="contents xl:sticky xl:top-20 xl:flex xl:w-80 xl:shrink-0 xl:flex-col xl:gap-6">
        <Card className="order-first xl:order-none">
          <CardContent className="flex flex-col gap-4">
            <StatusBadge status={quotation.status} className="self-start" />
            {validity && (
              <p
                className={cn(
                  "flex items-center gap-2 text-sm font-medium",
                  validity.isUrgent ? "text-warning-700" : "text-gray-700",
                )}
              >
                <Clock aria-hidden className="size-4" />
                {validity.text}
              </p>
            )}
            {quotation.order && (
              <p className="text-sm text-gray-700">
                Ordered as{" "}
                <Link
                  href={`/orders/${quotation.order.id}`}
                  className="font-medium text-navy-700 hover:underline"
                >
                  {quotation.order.number}
                </Link>
              </p>
            )}
            {quotation.status === "quoted" && <QuotationDecision quotationId={quotation.id} />}
          </CardContent>
        </Card>
        <Section title="History" className="order-last xl:order-none">
          <Timeline label="Quotation history" steps={getQuotationSteps(quotation)} />
        </Section>
      </aside>
    </div>
  );
}

type SectionProps = { title: string; children: ReactNode; className?: string };

function Section({ title, children, className }: SectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Note({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-medium text-gray-900">{label}</dt>
      <dd className="text-gray-700">{text}</dd>
    </div>
  );
}
