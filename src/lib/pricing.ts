import { calculateGst } from "@/lib/gst";

/** Any priced line: cart rows, order lines, quotation lines. Prices exclude GST. */
export type PricedLine = {
  quantity: number;
  unitPriceInPaise: number;
  /** The standard price before tier, contract or quotation discounts. */
  listPriceInPaise: number;
  gstRatePercent: number;
};

export type PricingSummary = {
  subtotalInPaise: number;
  savingsInPaise: number;
  gstInPaise: number;
};

/** GST is worked out per line, as it is on the GST invoice. */
export function summarisePricing(lines: readonly PricedLine[]): PricingSummary {
  return lines.reduce<PricingSummary>(
    (summary, line) => {
      const lineTotal = line.unitPriceInPaise * line.quantity;
      return {
        subtotalInPaise: summary.subtotalInPaise + lineTotal,
        savingsInPaise:
          summary.savingsInPaise + (line.listPriceInPaise - line.unitPriceInPaise) * line.quantity,
        gstInPaise: summary.gstInPaise + calculateGst(lineTotal, line.gstRatePercent),
      };
    },
    { subtotalInPaise: 0, savingsInPaise: 0, gstInPaise: 0 },
  );
}

/** Orders at or above this subtotal (excl. GST) are delivered free. */
export const FREE_DELIVERY_FROM_IN_PAISE = 5_000_00;
/** The delivery charge (excl. GST) on smaller orders. */
export const DELIVERY_CHARGE_IN_PAISE = 250_00;

export type OrderTotals = PricingSummary & {
  deliveryInPaise: number;
  totalInPaise: number;
};

/** Everything an order summary shows. Delivery is taxed at the standard rate, like the parts. */
export function calculateOrderTotals(lines: readonly PricedLine[]): OrderTotals {
  const pricing = summarisePricing(lines);
  const deliveryInPaise =
    lines.length === 0 || pricing.subtotalInPaise >= FREE_DELIVERY_FROM_IN_PAISE
      ? 0
      : DELIVERY_CHARGE_IN_PAISE;
  const gstInPaise = pricing.gstInPaise + calculateGst(deliveryInPaise);
  return {
    ...pricing,
    deliveryInPaise,
    gstInPaise,
    totalInPaise: pricing.subtotalInPaise + deliveryInPaise + gstInPaise,
  };
}
