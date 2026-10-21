import type { DocumentKind } from "@/features/documents/types";

export const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = {
  invoice: "GST invoice",
  credit_note: "Credit note",
  quotation: "Quotation",
};
