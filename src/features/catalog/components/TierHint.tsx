import type { TierPrice } from "@/features/catalog/types";
import { formatPrice } from "@/lib/format";

/** The first bulk-price break, e.g. "₹293 for 24+", or nothing for parts without tiers. */
export function TierHint({ tierPrices }: { tierPrices?: TierPrice[] }) {
  const [firstTier] = tierPrices ?? [];
  if (!firstTier) return null;

  return (
    <span className="text-xs font-medium whitespace-nowrap text-navy-700 tabular-nums">
      {formatPrice(firstTier.priceInPaise)} for {firstTier.minQty}+
    </span>
  );
}
