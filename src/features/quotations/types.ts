import type { BranchRef } from "@/features/company/types";
import type { ListParams } from "@/lib/types";

export type QuotationStatus = "requested" | "quoted" | "accepted" | "rejected" | "expired";

export type QuotationLine = {
  productId: string;
  partNumber: string;
  name: string;
  brand: string;
  quantity: number;
  /** This business's price per unit (the B2C price less its discount), excluding GST. */
  listPriceInPaise: number;
  /** The quoted price per unit, excluding GST: the business price, or lower after a revision. */
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

export type QuotationSort = "requestedAt" | "validUntil";

export type QuotationFilters = ListParams<QuotationSort> & {
  status?: QuotationStatus;
};

export type QuotationRequest = {
  branchId: string;
  notes?: string;
  items: { productId: string; quantity: number }[];
};
