import type { LineCheck, OrderLineDraft } from "@/features/quick-order/types";
import { formatCount } from "@/lib/format";

export type PastedLine = {
  partNumber: string;
  quantity: number;
};

/**
 * One "part number, quantity" per line. A comma, tab (pasted from Excel) or semicolon separates
 * the two; without one, a number at the end of the line is the quantity, so "RLN BS 1105 20"
 * works too. A line without a quantity asks for 1. Blank lines are skipped.
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
      return { partNumber, quantity: Number.isNaN(parsed) || parsed < 1 ? 1 : parsed };
    });
}

/** Upper case without spaces or dashes, so "mot 104092" matches "MOT-104092". */
export function normalisePartNumber(partNumber: string): string {
  return partNumber.toUpperCase().replace(/[^A-Z0-9]/g, "");
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
  return { status: "ready" };
}
