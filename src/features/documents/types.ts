import type { ListParams } from "@/lib/types";

export type DocumentKind = "invoice" | "credit_note" | "quotation";

/** A downloadable business document: a GST invoice, a credit note or a quotation PDF. */
export type BusinessDocument = {
  id: string;
  kind: DocumentKind;
  number: string;
  date: string;
  /** Including GST. */
  amountInPaise: number;
  /** What it belongs to, e.g. the order an invoice was raised for. */
  relatedTo?: { label: string; href: string };
  url: string;
};

export type DocumentFilters = ListParams<"date"> & {
  kind?: DocumentKind;
  /** Matches the document number, ignoring spaces and slashes. */
  q?: string;
  /** "YYYY-MM-DD", India time, inclusive. */
  from?: string;
  to?: string;
};
