import { getUnitPrice } from "@/features/catalog/utils";
import type { CartIssue, CartLine } from "@/features/cart/types";
import { formatCount, formatNumber } from "@/lib/format";
import type { PricedLine } from "@/lib/pricing";
import { snapQuantity } from "@/lib/quantity";

/** A cart line priced at the tier its quantity earns. */
export function toPricedLine({ product, quantity }: CartLine): PricedLine {
  return {
    quantity,
    unitPriceInPaise: getUnitPrice(product, quantity),
    listPriceInPaise: product.businessPriceInPaise,
    gstRatePercent: product.gstRatePercent,
  };
}

/** What, if anything, is wrong with a line given the stock at the delivery branch. */
export function getCartIssue({ product, quantity }: CartLine, stock: number): CartIssue | null {
  if (stock === 0) {
    return {
      message: "Out of stock at your delivery branch. Remove it or choose another branch.",
      isBlocking: true,
    };
  }
  const allowed = snapQuantity(quantity, { min: product.moq, step: product.packSize });
  if (allowed !== quantity) {
    return {
      message:
        quantity < product.moq
          ? `Below the minimum order of ${formatNumber(product.moq)}.`
          : `Sold in ${product.packName ?? "pack"}s of ${product.packSize}.`,
      isBlocking: true,
      fix: { label: `Change to ${formatNumber(allowed)}`, quantity: allowed },
    };
  }
  if (quantity > stock) {
    return {
      message: `Only ${formatCount(stock, product.unit)} in stock. The rest will follow when it arrives.`,
      isBlocking: false,
    };
  }
  return null;
}
