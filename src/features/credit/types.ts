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
  status: InvoiceStatus;
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
