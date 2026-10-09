import type { Product } from "@/features/catalog/types";
import type { LineCheck, OrderLineDraft } from "@/features/quick-order/types";
import { formatCount, formatNumber } from "@/lib/format";
import { snapQuantity } from "@/lib/quantity";

export type PastedLine = {
  partNumber: string;
  /** Null when the line had no quantity. */
  quantity: number | null;
};

/**
 * One "part number, quantity" per line. A comma, tab (pasted from Excel) or semicolon separates
 * the two; without one, a number at the end of the line is the quantity, so "RLN BS 1105 20"
 * works too. Blank lines are skipped.
 */
export function parsePastedList(text: string): PastedLine[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [partNumber, quantity = ""] = /[,;\t]/.test(line)
        ? line.split(/\s*[,;\t]\s*/)
        : (line.match(/^(.*\S)\s+(\d+)$/)?.slice(1) ?? [line]);
      const parsed = Number.parseInt(quantity, 10);
      return { partNumber, quantity: Number.isNaN(parsed) ? null : parsed };
    });
}

/** Upper case without spaces or dashes, so "mot 104092" matches "MOT-104092". */
export function normalisePartNumber(partNumber: string): string {
  return partNumber.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** Fits an asked-for quantity to the part's MOQ and pack size, saying why if it changed. */
export function fitQuantity(
  product: Pick<Product, "moq" | "packSize" | "packName" | "unit">,
  requested: number | null,
): Pick<OrderLineDraft, "quantity" | "adjustment"> {
  const rules = { min: product.moq, step: product.packSize };
  if (requested === null) {
    return {
      quantity: snapQuantity(product.moq, rules),
      adjustment: "No quantity given: set to the MOQ",
    };
  }
  const quantity = snapQuantity(requested, rules);
  if (quantity === requested) return { quantity };
  if (requested < product.moq) {
    return { quantity, adjustment: `Raised to the MOQ of ${formatNumber(product.moq)}` };
  }
  return {
    quantity,
    adjustment: `Rounded up to ${formatNumber(quantity)}: sold in ${product.packName ?? "pack"}s of ${product.packSize}`,
  };
}

/** Null for a row that is still empty. */
export function checkLine(line: OrderLineDraft, stock: number): LineCheck | null {
  if (!line.product) {
    return line.isUnmatched
      ? { status: "not_found", message: `No part number "${line.query}" in the catalogue` }
      : null;
  }
  if (stock === 0) {
    return { status: "out_of_stock", message: "Won't be added to the cart: none at your branch" };
  }
  if (line.quantity > stock) {
    return {
      status: "limited_stock",
      message: `Only ${formatCount(stock, line.product.unit)} at your delivery branch`,
    };
  }
  if (line.adjustment) return { status: "adjusted", message: line.adjustment };
  return { status: "ready" };
}
