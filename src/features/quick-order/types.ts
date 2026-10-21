import type { Product } from "@/features/catalog/types";

/** One row being typed or pasted into Quick order (or a quotation request). Never sent to the API. */
export type OrderLineDraft = {
  id: string;
  /** What is in the part-number box. */
  query: string;
  product: Product | null;
  quantity: number;
  /** A pasted part number that matched nothing in the catalogue. */
  isUnmatched?: boolean;
};

/** How a row stands against the catalogue and the delivery branch's stock. */
export type LineStatus = "ready" | "limited_stock" | "out_of_stock" | "not_found";

export type LineCheck = {
  status: LineStatus;
  message?: string;
};

/** A row together with its stock at the delivery branch and how it checks out. */
export type CheckedLine = {
  line: OrderLineDraft;
  stock: number;
  check: LineCheck | null;
};
