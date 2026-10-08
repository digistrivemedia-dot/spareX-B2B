import type { Product } from "@/features/catalog/types";

/** The unit price (excl. GST) this quantity earns: the best tier reached, else the business price. */
export function getUnitPrice(
  product: Pick<Product, "businessPriceInPaise" | "tierPrices">,
  quantity: number,
): number {
  return (product.tierPrices ?? [])
    .filter((tier) => quantity >= tier.minQty)
    .reduce((best, tier) => Math.min(best, tier.priceInPaise), product.businessPriceInPaise);
}
