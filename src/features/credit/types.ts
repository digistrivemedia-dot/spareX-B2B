import type { RazorpayChannel } from "@/features/orders/types";

export type CreditSummary = {
  limitInPaise: number;
  usedInPaise: number;
  availableInPaise: number;
  overdueInPaise: number;
  overdueInvoiceCount: number;
  termsDays: number;
  /** The next unpaid invoice to fall due (overdue ones excluded). */
  nextDue?: { date: string; amountInPaise: number };
};

export type InvoiceStatus = "due" | "overdue" | "paid";

export type Invoice = {
  id: string;
  number: string;
  order?: { id: string; number: string };
  issuedAt: string;
  dueDate: string;
  /** Invoice total, including GST. */
  amountInPaise: number;
  /** What is still unpaid. */
  balanceInPaise: number;
  /** Bank transfers the buyer reported that Kannali hasn't confirmed yet. */
  awaitingConfirmationInPaise: number;
  status: InvoiceStatus;
  /** The GST invoice as a PDF. */
  pdfUrl: string;
};

export type StatementEntryType = "invoice" | "payment" | "credit_note";

export type StatementEntry = {
  id: string;
  date: string;
  type: StatementEntryType;
  reference: string;
  description: string;
  debitInPaise: number;
  creditInPaise: number;
  /** Amount owed after this entry. */
  balanceInPaise: number;
};

export type StatementFilters = {
  /** "YYYY-MM-DD", India time, inclusive. */
  from?: string;
  to?: string;
};

/** The account's entries for a period, with what was owed before and after it. */
export type Statement = {
  openingBalanceInPaise: number;
  closingBalanceInPaise: number;
  entries: StatementEntry[];
};

/** Paying invoices online settles them at once; a bank transfer waits for Kannali to confirm it. */
export type PayInvoicesRequest = {
  invoiceIds: string[];
  payment:
    | { method: "razorpay"; channel: RazorpayChannel }
    | { method: "bank_transfer"; transferReference: string };
};

export type PayInvoicesResult = {
  paymentId: string;
  amountInPaise: number;
  isConfirmed: boolean;
};
