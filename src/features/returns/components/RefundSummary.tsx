import type { ReactNode } from "react";

import { SectionCard } from "@/components/ui/SectionCard";
import type { RefundMethod } from "@/features/returns/types";
import { formatPrice } from "@/lib/format";

type RefundSummaryProps = {
  refundInPaise: number;
  refundMethod: RefundMethod;
  /** True once the money has gone back. */
  isRefunded?: boolean;
  /** e.g. the submit button. */
  children?: ReactNode;
};

const DESCRIPTIONS = {
  credit_note: {
    pending: "As a credit note against your account, once Kannali receives the parts.",
    done: "Refunded as a credit note against your account.",
  },
  original_payment: {
    pending: "To the way you paid, once Kannali receives the parts.",
    done: "Refunded to the way you paid.",
  },
};

/** How much comes back, and how. */
export function RefundSummary({
  refundInPaise,
  refundMethod,
  isRefunded = false,
  children,
}: RefundSummaryProps) {
  return (
    <SectionCard title="Refund">
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-gray-600">Refund (incl. GST)</span>
          <span className="text-xl font-semibold text-gray-900 tabular-nums">
            {formatPrice(refundInPaise)}
          </span>
        </div>
        <p className="text-gray-600">
          {DESCRIPTIONS[refundMethod][isRefunded ? "done" : "pending"]}
        </p>
        {children}
      </div>
    </SectionCard>
  );
}
