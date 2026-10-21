import type {
  CreditSummary,
  Invoice,
  PayInvoicesRequest,
  PayInvoicesResult,
  Statement,
  StatementEntry,
  StatementFilters,
} from "@/features/credit/types";
import type { RazorpayChannel } from "@/features/orders/types";
import { ApiError } from "@/lib/api-client";
import { toIndiaDate } from "@/lib/dates";
import { demoRazorpayId, orders } from "@/mocks/orders";
import { returns } from "@/mocks/returns";
import { daysFromToday, findById, simulateLatency } from "@/mocks/utils";

const CREDIT_LIMIT_IN_PAISE = 300_000_00;
const TERMS_DAYS = 30;

/** A GST invoice raised on credit. Balances are worked out from payments and credit notes. */
type InvoiceRecord = {
  id: string;
  number: string;
  issuedAt: string;
  dueDate: string;
  amountInPaise: number;
  order?: { id: string; number: string };
};

const pdfUrl = (number: string) => `/documents/invoices/${number.replaceAll("/", "-")}.pdf`;

/** An invoice raised `issuedDay` days from today, due at the end of its credit term. */
function issued(id: string, number: string, issuedDay: number, amountInPaise: number) {
  return {
    id,
    number,
    issuedAt: daysFromToday(issuedDay, 18),
    dueDate: daysFromToday(issuedDay + TERMS_DAYS, 23, 59),
    amountInPaise,
  };
}

/** An invoice for one of the demo orders takes its amount from that order. */
function orderInvoice(orderId: string, issuedDay: number): InvoiceRecord {
  const { id, number, invoice, totalInPaise } = findById(orders, orderId);
  if (!invoice) throw new Error(`Demo data: order "${orderId}" has no invoice`);
  return { ...issued(invoice.id, invoice.number, issuedDay, totalInPaise), order: { id, number } };
}

/** A payment against one or more credit invoices. */
export type CreditPayment = {
  id: string;
  date: string;
  method: "razorpay" | "bank_transfer";
  channel?: RazorpayChannel;
  reference: string;
  allocations: { invoiceId: string; amountInPaise: number }[];
  status: "successful" | "awaiting_confirmation" | "failed";
};

type CreditNote = {
  id: string;
  number: string;
  date: string;
  invoiceId: string;
  amountInPaise: number;
  description: string;
};

const returnRefund = findById(returns, "ret-0012");

export const creditNotes: CreditNote[] = [
  {
    id: "cn-0031",
    number: "CN/26-27/0031",
    date: daysFromToday(-45, 16),
    invoiceId: "inv-1004",
    amountInPaise: 1_480_00,
    description: "Return against KG/26-27/1004: 10 Philips HS1 bulbs damaged in transit",
  },
  {
    id: "cn-0034",
    number: "CN/26-27/0034",
    date: returnRefund.timeline.at(-1)?.at ?? daysFromToday(-8),
    invoiceId: "inv-1112",
    amountInPaise: returnRefund.refundInPaise,
    description: `Return ${returnRefund.number} against KG/26-27/1112: KTM front brake pads, wrong part`,
  },
];

export const creditPayments: CreditPayment[] = [
  {
    id: "cp-0961",
    date: daysFromToday(-28, 12),
    method: "bank_transfer",
    reference: "HDFCN52026091874",
    allocations: [{ invoiceId: "inv-0961", amountInPaise: 31_200_00 }],
    status: "successful",
  },
  {
    id: "cp-0978",
    date: daysFromToday(-25, 15),
    method: "razorpay",
    channel: "upi",
    reference: "pay_P3vRt7Lw9KcQ2m",
    allocations: [{ invoiceId: "inv-0978", amountInPaise: 9_800_00 }],
    status: "successful",
  },
  {
    id: "cp-1004",
    date: daysFromToday(-20, 11),
    method: "bank_transfer",
    reference: "ICICN72026092611",
    allocations: [{ invoiceId: "inv-1004", amountInPaise: 15_000_00 }],
    status: "successful",
  },
  {
    id: "cp-fail-1037",
    date: daysFromToday(-6, 19, 25),
    method: "razorpay",
    channel: "card",
    reference: "pay_Q2hNs8Vb5Xe1Kd",
    allocations: [{ invoiceId: "inv-1037", amountInPaise: 12_800_00 }],
    status: "failed",
  },
];

const outstanding: InvoiceRecord[] = [
  issued("inv-1037", "KG/26-27/1037", -39, 12_800_00),
  orderInvoice("ord-0398", -27),
  orderInvoice("ord-0409", -12),
  orderInvoice("ord-0414", -2),
];

const creditedTo = (invoiceId: string) =>
  creditNotes
    .filter((note) => note.invoiceId === invoiceId)
    .reduce((sum, note) => sum + note.amountInPaise, 0);

/**
 * Sized so the outstanding total is exactly the ₹1,18,450 used in the brief,
 * whatever the order totals and credit notes above come to.
 */
const balancingInvoice = issued(
  "inv-1088",
  "KG/26-27/1088",
  -22,
  118_450_00 -
    outstanding.reduce((sum, record) => sum + record.amountInPaise - creditedTo(record.id), 0),
);

const invoiceRecords: InvoiceRecord[] = [
  issued("inv-0961", "KG/26-27/0961", -58, 31_200_00),
  issued("inv-0978", "KG/26-27/0978", -55, 9_800_00),
  issued("inv-1004", "KG/26-27/1004", -50, 16_480_00),
  ...outstanding,
  balancingInvoice,
];

function allocated(invoiceId: string, status: CreditPayment["status"]) {
  return creditPayments
    .filter((payment) => payment.status === status)
    .flatMap((payment) => payment.allocations)
    .filter((allocation) => allocation.invoiceId === invoiceId)
    .reduce((sum, allocation) => sum + allocation.amountInPaise, 0);
}

function toInvoice(record: InvoiceRecord): Invoice {
  const balanceInPaise =
    record.amountInPaise - allocated(record.id, "successful") - creditedTo(record.id);
  return {
    ...record,
    balanceInPaise,
    awaitingConfirmationInPaise: allocated(record.id, "awaiting_confirmation"),
    status:
      balanceInPaise === 0 ? "paid" : new Date(record.dueDate) < new Date() ? "overdue" : "due",
    pdfUrl: pdfUrl(record.number),
  };
}

/** Every credit invoice, soonest due first. */
export function listInvoices(): Invoice[] {
  return invoiceRecords.map(toInvoice).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export async function getUnpaidInvoicesMock(): Promise<Invoice[]> {
  await simulateLatency();
  return listInvoices().filter((invoice) => invoice.status !== "paid");
}

export async function getCreditSummaryMock(): Promise<CreditSummary> {
  await simulateLatency();
  const unpaid = listInvoices().filter((invoice) => invoice.status !== "paid");
  const overdue = unpaid.filter((invoice) => invoice.status === "overdue");
  const nextDue = unpaid.find((invoice) => invoice.status === "due");
  const usedInPaise = unpaid.reduce((sum, invoice) => sum + invoice.balanceInPaise, 0);
  return {
    limitInPaise: CREDIT_LIMIT_IN_PAISE,
    usedInPaise,
    availableInPaise: CREDIT_LIMIT_IN_PAISE - usedInPaise,
    overdueInPaise: overdue.reduce((sum, invoice) => sum + invoice.balanceInPaise, 0),
    overdueInvoiceCount: overdue.length,
    termsDays: TERMS_DAYS,
    nextDue: nextDue && { date: nextDue.dueDate, amountInPaise: nextDue.balanceInPaise },
  };
}

type EntrySeed = Omit<StatementEntry, "balanceInPaise">;

/** Invoices, confirmed payments and credit notes, oldest first, with the running balance. */
function buildStatement(): StatementEntry[] {
  const seeds: EntrySeed[] = [
    ...invoiceRecords.map((record) => ({
      id: `st-${record.id}`,
      date: record.issuedAt,
      type: "invoice" as const,
      reference: record.number,
      description: record.order ? `Tax invoice for ${record.order.number}` : "Tax invoice",
      debitInPaise: record.amountInPaise,
      creditInPaise: 0,
    })),
    ...creditPayments
      .filter((payment) => payment.status === "successful")
      .map((payment) => {
        const total = payment.allocations.reduce((sum, a) => sum + a.amountInPaise, 0);
        const numbers = payment.allocations
          .map((a) => findById(invoiceRecords, a.invoiceId).number)
          .join(", ");
        return {
          id: `st-${payment.id}`,
          date: payment.date,
          type: "payment" as const,
          reference: `${payment.method === "razorpay" ? "Razorpay" : "NEFT UTR"} ${payment.reference}`,
          description: `Payment received against ${numbers}`,
          debitInPaise: 0,
          creditInPaise: total,
        };
      }),
    ...creditNotes.map((note) => ({
      id: `st-${note.id}`,
      date: note.date,
      type: "credit_note" as const,
      reference: note.number,
      description: note.description,
      debitInPaise: 0,
      creditInPaise: note.amountInPaise,
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  let balance = 0;
  return seeds.map((seed) => {
    balance += seed.debitInPaise - seed.creditInPaise;
    return { ...seed, balanceInPaise: balance };
  });
}

export async function getStatementMock({ from, to }: StatementFilters): Promise<Statement> {
  await simulateLatency();
  const all = buildStatement();
  const before = all.filter((entry) => from && toIndiaDate(entry.date) < from);
  const entries = all.filter(
    (entry) => (!from || toIndiaDate(entry.date) >= from) && (!to || toIndiaDate(entry.date) <= to),
  );
  const openingBalanceInPaise = before.at(-1)?.balanceInPaise ?? 0;
  return {
    openingBalanceInPaise,
    closingBalanceInPaise: entries.at(-1)?.balanceInPaise ?? openingBalanceInPaise,
    entries,
  };
}

/** Online payments settle the invoices at once; a bank transfer waits for Kannali to confirm it. */
export async function payInvoicesMock({
  invoiceIds,
  payment,
}: PayInvoicesRequest): Promise<PayInvoicesResult> {
  await simulateLatency(1000);
  const unpaid = listInvoices().filter(
    (invoice) => invoiceIds.includes(invoice.id) && invoice.status !== "paid",
  );
  if (unpaid.length === 0) {
    throw new ApiError(409, { message: "These invoices are already paid. Refresh the page." });
  }
  const isOnline = payment.method === "razorpay";
  const created: CreditPayment = {
    id: `cp-${Date.now()}`,
    date: new Date().toISOString(),
    method: payment.method,
    channel: isOnline ? payment.channel : undefined,
    reference: isOnline ? demoRazorpayId() : payment.transferReference,
    allocations: unpaid.map((invoice) => ({
      invoiceId: invoice.id,
      amountInPaise: invoice.balanceInPaise,
    })),
    status: isOnline ? "successful" : "awaiting_confirmation",
  };
  creditPayments.push(created);
  return {
    paymentId: created.id,
    amountInPaise: created.allocations.reduce((sum, a) => sum + a.amountInPaise, 0),
    isConfirmed: isOnline,
  };
}
