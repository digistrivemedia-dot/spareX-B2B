import { FileClock, ReceiptIndianRupee, Truck, Wallet } from "lucide-react";

import { StatCard } from "@/components/ui/StatCard";
import { UsageBar } from "@/components/ui/UsageBar";
import type { CreditSummary } from "@/features/credit/types";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type DashboardStatsProps = {
  /** Null when credit isn't enabled: the two credit cards are left out. */
  credit: CreditSummary | null;
  openOrderCount: number;
  quotationsAwaiting: number;
  /** When the soonest quotation awaiting a reply expires. */
  nextQuotationExpiry?: string;
};

export function DashboardStats({
  credit,
  openOrderCount,
  quotationsAwaiting,
  nextQuotationExpiry,
}: DashboardStatsProps) {
  return (
    <div className={cn("mb-8 grid gap-4 sm:grid-cols-2", credit && "xl:grid-cols-4")}>
      {credit && <CreditStats credit={credit} />}
      <StatCard
        label="Open orders"
        value={openOrderCount}
        icon={Truck}
        href="/orders"
        description="Placed and not yet delivered"
      />
      <StatCard
        label="Quotations awaiting you"
        value={quotationsAwaiting}
        icon={FileClock}
        href="/quotations?status=quoted"
        description={
          nextQuotationExpiry
            ? `Earliest expires ${formatDate(nextQuotationExpiry)}`
            : "Nothing to review"
        }
      />
    </div>
  );
}

function CreditStats({ credit }: { credit: CreditSummary }) {
  return (
    <>
      <StatCard
        label="Credit available"
        value={formatPrice(credit.availableInPaise)}
        icon={Wallet}
        href="/credit"
        description={`${formatPrice(credit.usedInPaise)} used of ${formatPrice(credit.limitInPaise)}`}
      >
        <UsageBar used={credit.usedInPaise} limit={credit.limitInPaise} label="Credit used" />
      </StatCard>
      <StatCard
        label="Outstanding"
        value={formatPrice(credit.usedInPaise)}
        icon={ReceiptIndianRupee}
        href="/credit"
        description={
          credit.nextDue
            ? `Incl. GST · next ${formatPrice(credit.nextDue.amountInPaise)} due ${formatDate(credit.nextDue.date)}`
            : "Nothing due right now"
        }
      />
    </>
  );
}
