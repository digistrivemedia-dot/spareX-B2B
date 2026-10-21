import type { CartIssue, CartLine } from "@/features/cart/types";
import { formatCount } from "@/lib/format";
import type { PricedLine } from "@/lib/pricing";

/** A cart line at the business price; the saving is measured against the B2C price. */
export function toPricedLine({ product, quantity }: CartLine): PricedLine {
  return {
    quantity,
    unitPriceInPaise: product.businessPriceInPaise,
    listPriceInPaise: product.b2cPriceInPaise,
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
  if (quantity > stock) {
    return {
      message: `Only ${formatCount(stock, product.unit)} in stock. The rest will follow when it arrives.`,
      isBlocking: false,
    };
  }
  return null;
}
