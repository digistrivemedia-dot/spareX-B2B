import type { BranchRef } from "@/features/company/types";
import type { ListParams } from "@/lib/types";

export type ReturnStatus = "requested" | "approved" | "picked_up" | "refunded" | "rejected";

export type ReturnReason =
  "damaged_in_transit" | "wrong_part" | "does_not_fit" | "defective" | "not_needed";

export type ReturnLine = {
  productId: string;
  partNumber: string;
  name: string;
  quantity: number;
  /** The price paid per unit, excluding GST. */
  unitPriceInPaise: number;
  gstRatePercent: number;
};

/** Credit customers get a credit note; everyone else is refunded the way they paid. */
export type RefundMethod = "credit_note" | "original_payment";

export type ReturnEvent = {
  status: ReturnStatus;
  at: string;
  note?: string;
};

export type ReturnRequest = {
  id: string;
  number: string;
  order: { id: string; number: string };
  branch: BranchRef;
  status: ReturnStatus;
  requestedAt: string;
  reason: ReturnReason;
  notes?: string;
  /** Photo URLs. */
  photos: string[];
  items: ReturnLine[];
  itemCount: number;
  /** What is refunded once Kannali receives the parts, including GST. */
  refundInPaise: number;
  refundMethod: RefundMethod;
  /** Why Kannali turned the return down. */
  rejectionReason?: string;
  timeline: ReturnEvent[];
};

/** What the returns list returns per row. */
export type ReturnSummary = Omit<ReturnRequest, "items" | "timeline" | "photos">;

export type ReturnFilters = ListParams<"requestedAt"> & {
  orderId?: string;
};

export type CreateReturnRequest = {
  orderId: string;
  reason: ReturnReason;
  notes?: string;
  /** Photos as uploaded; the demo keeps them as data URLs. */
  photos: string[];
  items: { productId: string; quantity: number }[];
};

/** An order line as the return form shows it: `quantity` was ordered, `returnable` is left. */
export type ReturnableLine = ReturnLine & { returnable: number };
