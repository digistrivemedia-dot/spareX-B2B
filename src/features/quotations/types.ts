import type { BranchRef } from "@/features/company/types";

export type QuotationStatus = "requested" | "quoted" | "accepted" | "rejected" | "expired";

export type QuotationLine = {
  productId: string;
  partNumber: string;
  name: string;
  brand: string;
  quantity: number;
  /** The customer's standard price per unit, excluding GST. */
  listPriceInPaise: number;
  /** Kannali's quoted price per unit, excluding GST. Absent until quoted. */
  quotedPriceInPaise?: number;
  gstRatePercent: number;
};

export type Attachment = {
  id: string;
  name: string;
  sizeInBytes: number;
  url: string;
};

export type QuotationEvent = {
  status: QuotationStatus;
  at: string;
  note?: string;
};

export type Quotation = {
  id: string;
  number: string;
  status: QuotationStatus;
  requestedAt: string;
  quotedAt?: string;
  validUntil?: string;
  branch: BranchRef;
  itemCount: number;
  items: QuotationLine[];
  /** Quoted amounts, present once Kannali has quoted. */
  subtotalInPaise?: number;
  gstInPaise?: number;
  totalInPaise?: number;
  customerNotes?: string;
  kannaliNotes?: string;
  attachments: Attachment[];
  /** Set once the quotation is accepted and converted. */
  order?: { id: string; number: string };
  timeline: QuotationEvent[];
};

/** What the quotation list returns per row. */
export type QuotationSummary = Omit<Quotation, "items" | "timeline" | "attachments">;
