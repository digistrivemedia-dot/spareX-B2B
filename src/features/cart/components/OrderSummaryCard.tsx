import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_GST_RATE_PERCENT } from "@/lib/gst";
import { formatCount, formatPrice } from "@/lib/format";
import { FREE_DELIVERY_FROM_IN_PAISE, type OrderTotals } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type OrderSummaryCardProps = {
  totals: OrderTotals;
  itemCount: number;
  /** Buttons and notes under the total. */
  children?: ReactNode;
};

/** Subtotal, savings, delivery, GST and the total, as the cart and checkout show them. */
export function OrderSummaryCard({ totals, itemCount, children }: OrderSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <dl className="flex flex-col gap-2 text-sm">
          <SummaryRow
            label={`Subtotal (${formatCount(itemCount, "item")}, excl. GST)`}
            value={formatPrice(totals.subtotalInPaise)}
          />
          {totals.savingsInPaise > 0 && (
            <SummaryRow
              label="You save against B2C prices"
              value={formatPrice(totals.savingsInPaise)}
              isSaving
            />
          )}
          <SummaryRow
            label="Delivery (excl. GST)"
            value={totals.deliveryInPaise === 0 ? "Free" : formatPrice(totals.deliveryInPaise)}
          />
          <SummaryRow
            label={`GST (${DEFAULT_GST_RATE_PERCENT}%)`}
            value={formatPrice(totals.gstInPaise)}
          />
          <div className="mt-1 flex items-baseline justify-between border-t border-gray-200 pt-3">
            <dt className="font-semibold text-gray-900">Total (incl. GST)</dt>
            <dd className="text-xl font-semibold text-gray-900 tabular-nums">
              {formatPrice(totals.totalInPaise)}
            </dd>
          </div>
        </dl>
        {totals.deliveryInPaise > 0 && (
          <p className="text-xs text-gray-500">
            Free delivery on orders of {formatPrice(FREE_DELIVERY_FROM_IN_PAISE)} or more (excl.
            GST).
          </p>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

type SummaryRowProps = { label: string; value: string; isSaving?: boolean };

function SummaryRow({ label, value, isSaving }: SummaryRowProps) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-gray-600">{label}</dt>
      <dd
        className={cn("font-medium tabular-nums", isSaving ? "text-success-700" : "text-gray-900")}
      >
        {value}
      </dd>
    </div>
  );
}
