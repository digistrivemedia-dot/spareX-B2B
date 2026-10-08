import type { CreditSummary, Invoice, StatementEntry } from "@/features/credit/types";
import { orders } from "@/mocks/orders";
import { daysFromToday, findById } from "@/mocks/utils";

const CREDIT_LIMIT_IN_PAISE = 300_000_00;
const TERMS_DAYS = 30;

type InvoiceSeed = {
  id: string;
  number: string;
  /** Days from today the invoice was raised (negative = in the past). */
  issuedDay: number;
  amountInPaise: number;
  paidInPaise?: number;
  order?: { id: string; number: string };
};

/** An invoice for one of the demo orders takes its amount from that order. */
function orderInvoice(orderId: string, issuedDay: number): InvoiceSeed {
  const { id, number, invoice, totalInPaise } = findById(orders, orderId);
  if (!invoice) throw new Error(`Demo data: order "${orderId}" has no invoice`);
  return { ...invoice, issuedDay, amountInPaise: totalInPaise, order: { id, number } };
}

function invoice(seed: InvoiceSeed): Invoice {
  const dueDay = seed.issuedDay + TERMS_DAYS;
  const balanceInPaise = seed.amountInPaise - (seed.paidInPaise ?? 0);
  return {
    id: seed.id,
    number: seed.number,
    order: seed.order,
    issuedAt: daysFromToday(seed.issuedDay, 18),
    dueDate: daysFromToday(dueDay, 23, 59),
    amountInPaise: seed.amountInPaise,
    balanceInPaise,
    status: balanceInPaise === 0 ? "paid" : dueDay < 0 ? "overdue" : "due",
  };
}

const outstanding: InvoiceSeed[] = [
  { id: "inv-1037", number: "KG/26-27/1037", issuedDay: -39, amountInPaise: 12_800_00 },
  orderInvoice("ord-0398", -27),
  orderInvoice("ord-0409", -12),
  orderInvoice("ord-0414", -2),
];

/**
 * Sized so the outstanding total is exactly the ₹1,18,450 used in the brief,
 * whatever the order totals above come to.
 */
const balancingInvoice: InvoiceSeed = {
  id: "inv-1088",
  number: "KG/26-27/1088",
  issuedDay: -22,
  amountInPaise: 118_450_00 - outstanding.reduce((sum, seed) => sum + seed.amountInPaise, 0),
};

const paid: InvoiceSeed[] = [
  {
    id: "inv-0961",
    number: "KG/26-27/0961",
    issuedDay: -58,
    amountInPaise: 31_200_00,
    paidInPaise: 31_200_00,
  },
  {
    id: "inv-0978",
    number: "KG/26-27/0978",
    issuedDay: -55,
    amountInPaise: 9_800_00,
    paidInPaise: 9_800_00,
  },
  {
    id: "inv-1004",
    number: "KG/26-27/1004",
    issuedDay: -50,
    amountInPaise: 16_480_00,
    paidInPaise: 16_480_00,
  },
];

export const invoices: Invoice[] = [...outstanding, balancingInvoice, ...paid]
  .map(invoice)
  .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

type EntrySeed = Omit<StatementEntry, "balanceInPaise">;

function invoiceEntry(seed: InvoiceSeed): EntrySeed {
  return {
    id: `st-${seed.id}`,
    date: daysFromToday(seed.issuedDay, 18),
    type: "invoice",
    reference: seed.number,
    description: seed.order ? `Tax invoice for ${seed.order.number}` : "Tax invoice",
    debitInPaise: seed.amountInPaise,
    creditInPaise: 0,
  };
}

const entries: EntrySeed[] = [
  invoiceEntry(paid[0]),
  invoiceEntry(paid[1]),
  invoiceEntry(paid[2]),
  {
    id: "st-cn-0031",
    date: daysFromToday(-45, 16),
    type: "credit_note",
    reference: "CN/26-27/0031",
    description: "Return against KG/26-27/1004: 10 Philips HS1 bulbs damaged in transit",
    debitInPaise: 0,
    creditInPaise: 1_480_00,
  },
  invoiceEntry(outstanding[0]),
  {
    id: "st-pay-0961",
    date: daysFromToday(-28, 12),
    type: "payment",
    reference: "NEFT UTR HDFCN52026091874",
    description: "Payment received against KG/26-27/0961",
    debitInPaise: 0,
    creditInPaise: 31_200_00,
  },
  invoiceEntry(outstanding[1]),
  {
    id: "st-pay-0978",
    date: daysFromToday(-25, 15),
    type: "payment",
    reference: "UPI 627104559812",
    description: "Payment received against KG/26-27/0978",
    debitInPaise: 0,
    creditInPaise: 9_800_00,
  },
  invoiceEntry(balancingInvoice),
  {
    id: "st-pay-1004",
    date: daysFromToday(-20, 11),
    type: "payment",
    reference: "NEFT UTR ICICN72026092611",
    description: "Payment received against KG/26-27/1004 (net of CN/26-27/0031)",
    debitInPaise: 0,
    creditInPaise: 15_000_00,
  },
  invoiceEntry(outstanding[2]),
  invoiceEntry(outstanding[3]),
];

/** Oldest first, each row carrying the balance owed after it. */
export const statement: StatementEntry[] = entries.reduce<StatementEntry[]>((rows, entry) => {
  const previousBalance = rows.at(-1)?.balanceInPaise ?? 0;
  return [
    ...rows,
    { ...entry, balanceInPaise: previousBalance + entry.debitInPaise - entry.creditInPaise },
  ];
}, []);

const unpaid = invoices.filter((inv) => inv.status !== "paid");
const overdue = unpaid.filter((inv) => inv.status === "overdue");
const nextDue = unpaid.find((inv) => inv.status === "due");
const usedInPaise = unpaid.reduce((sum, inv) => sum + inv.balanceInPaise, 0);

export const creditSummary: CreditSummary = {
  limitInPaise: CREDIT_LIMIT_IN_PAISE,
  usedInPaise,
  availableInPaise: CREDIT_LIMIT_IN_PAISE - usedInPaise,
  overdueInPaise: overdue.reduce((sum, inv) => sum + inv.balanceInPaise, 0),
  overdueInvoiceCount: overdue.length,
  termsDays: TERMS_DAYS,
  nextDue: nextDue && { date: nextDue.dueDate, amountInPaise: nextDue.balanceInPaise },
};
