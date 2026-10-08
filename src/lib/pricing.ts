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
