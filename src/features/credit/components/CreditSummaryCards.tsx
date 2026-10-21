import { CalendarClock, CircleAlert, Landmark, ReceiptIndianRupee, Wallet } from "lucide-react";

import { StatCard } from "@/components/ui/StatCard";
import { UsageBar } from "@/components/ui/UsageBar";
import type { CreditSummary } from "@/features/credit/types";
import { formatCount, formatDate, formatPrice } from "@/lib/format";

export function CreditSummaryCards({ credit }: { credit: CreditSummary }) {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        label="Credit limit"
        value={formatPrice(credit.limitInPaise)}
        icon={Landmark}
        description="Set by Kannali"
      />
      <StatCard
        label="Used"
        value={formatPrice(credit.usedInPaise)}
        icon={ReceiptIndianRupee}
        description={
          credit.nextDue
            ? `Incl. GST · next due ${formatDate(credit.nextDue.date)}`
            : "Incl. GST · nothing due"
        }
      />
      <StatCard
        label="Available"
        value={formatPrice(credit.availableInPaise)}
        icon={Wallet}
        description={`${formatPrice(credit.usedInPaise)} used of ${formatPrice(credit.limitInPaise)}`}
      >
        <UsageBar used={credit.usedInPaise} limit={credit.limitInPaise} label="Credit used" />
      </StatCard>
      <StatCard
        label="Overdue"
        value={
          <span className={credit.overdueInPaise > 0 ? "text-danger-700" : undefined}>
            {formatPrice(credit.overdueInPaise)}
          </span>
        }
        icon={CircleAlert}
        description={
          credit.overdueInvoiceCount > 0
            ? `${formatCount(credit.overdueInvoiceCount, "invoice")} past due`
            : "Nothing overdue"
        }
      />
      <StatCard
        label="Terms"
        value={`Net ${credit.termsDays}`}
        icon={CalendarClock}
        description={`Pay within ${credit.termsDays} days of each invoice`}
      />
    </div>
  );
}
