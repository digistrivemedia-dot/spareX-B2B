import type { Quotation } from "@/features/quotations/types";
import { DEFAULT_GST_RATE_PERCENT } from "@/lib/gst";
import { formatPrice } from "@/lib/format";

/** The quoted subtotal, savings against standard prices, GST and total. */
export function QuotationTotals({ quotation }: { quotation: Quotation }) {
  const { subtotalInPaise, gstInPaise, totalInPaise, items } = quotation;
  if (subtotalInPaise === undefined || gstInPaise === undefined || totalInPaise === undefined) {
    return null;
  }
  const listTotal = items.reduce((sum, line) => sum + line.listPriceInPaise * line.quantity, 0);
  const savings = listTotal - subtotalInPaise;

  const rows = [
    { label: "Subtotal (excl. GST)", value: formatPrice(subtotalInPaise) },
    ...(savings > 0
      ? [{ label: "You save against your usual prices", value: formatPrice(savings) }]
      : []),
    { label: `GST (${DEFAULT_GST_RATE_PERCENT}%)`, value: formatPrice(gstInPaise) },
  ];

  return (
    <dl className="ml-auto flex w-full max-w-sm flex-col gap-2 text-sm">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex justify-between gap-4">
          <dt className="text-gray-600">{label}</dt>
          <dd className="font-medium text-gray-900 tabular-nums">{value}</dd>
        </div>
      ))}
      <div className="flex items-baseline justify-between border-t border-gray-200 pt-3">
        <dt className="font-semibold text-gray-900">Total (incl. GST)</dt>
        <dd className="text-xl font-semibold text-gray-900 tabular-nums">
          {formatPrice(totalInPaise)}
        </dd>
      </div>
    </dl>
  );
}
