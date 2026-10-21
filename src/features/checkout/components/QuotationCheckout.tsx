"use client";

import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";
import { useBranches } from "@/features/company/components/BranchesProvider";
import type { CreditSummary } from "@/features/credit/types";
import type { Quotation } from "@/features/quotations/types";
import { formatPhone } from "@/lib/format";
import { calculateOrderTotals } from "@/lib/pricing";

type QuotationCheckoutProps = {
  quotation: Quotation;
  credit: CreditSummary | null;
};

/** Checkout for an accepted quotation: its parts at the quoted prices, to its branch. The cart is untouched. */
export function QuotationCheckout({ quotation, credit }: QuotationCheckoutProps) {
  const router = useRouter();
  const branch = useBranches().find((candidate) => candidate.id === quotation.branch.id);
  const totals = calculateOrderTotals(
    quotation.items.map((line) => ({
      ...line,
      unitPriceInPaise: line.quotedPriceInPaise ?? line.listPriceInPaise,
    })),
  );

  return (
    <CheckoutForm
      items={quotation.items.map(({ productId, quantity }) => ({ productId, quantity }))}
      totals={totals}
      savingsLabel="You save against your business prices"
      credit={credit}
      branchId={quotation.branch.id}
      quotationId={quotation.id}
      delivery={
        <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
          <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-navy-700" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-gray-900">{quotation.branch.name}</span>
            {branch && (
              <>
                <span className="text-gray-600">
                  {[branch.address.line1, branch.address.line2, branch.address.city].join(", ")}{" "}
                  {branch.address.pin}
                </span>
                <span className="text-xs text-gray-500">
                  {branch.contactName} · {formatPhone(branch.contactPhone)}
                </span>
              </>
            )}
            <span className="text-xs text-gray-500">
              Set on the quotation. Ask for a revision to deliver somewhere else.
            </span>
          </div>
        </div>
      }
      backLink={{ href: `/quotations/${quotation.id}`, label: "Back to quotation" }}
      onPlaced={(order) => router.push(`/checkout/success?order=${order.id}`)}
    />
  );
}
