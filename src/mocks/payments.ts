import type { Order } from "@/features/orders/types";
import type { Payment, PaymentFilters } from "@/features/payments/types";
import type { Paginated } from "@/lib/types";
import { creditPayments, listInvoices } from "@/mocks/credit";
import { orders } from "@/mocks/orders";
import { paginate, simulateLatency, sortItems } from "@/mocks/utils";

/** An order paid up front (Razorpay, bank transfer or cash), as a payment record. */
function orderPayment(order: Order): Payment | null {
  const { payment } = order;
  const target = [
    {
      kind: "order" as const,
      id: order.id,
      number: order.number,
      amountInPaise: order.totalInPaise,
    },
  ];
  const base = {
    id: `pay-${order.id}`,
    method: payment.method,
    channel: payment.channel,
    reference: payment.reference,
    amountInPaise: order.totalInPaise,
    appliedTo: target,
  };
  if (payment.method === "credit") return null;
  if (payment.status === "paid" || payment.status === "refunded") {
    return {
      ...base,
      date: payment.paidAt ?? order.placedAt,
      status: payment.status === "paid" ? "successful" : "refunded",
    };
  }
  // A bank transfer the buyer has reported, waiting for Kannali to find it.
  if (payment.method === "bank_transfer" && payment.reference && payment.status === "pending") {
    return { ...base, date: order.placedAt, status: "awaiting_confirmation" };
  }
  return null;
}

/** Every payment: orders paid up front, and payments against credit invoices. */
function listPayments(): Payment[] {
  const invoices = listInvoices();
  const fromCredit = creditPayments.map(({ allocations, ...payment }): Payment => ({
    ...payment,
    amountInPaise: allocations.reduce((sum, a) => sum + a.amountInPaise, 0),
    appliedTo: allocations.map((allocation) => {
      const invoice = invoices.find((candidate) => candidate.id === allocation.invoiceId);
      return {
        kind: "invoice",
        id: allocation.invoiceId,
        number: invoice?.number ?? allocation.invoiceId,
        amountInPaise: allocation.amountInPaise,
      };
    }),
  }));
  const fromOrders = orders.flatMap((order) => orderPayment(order) ?? []);
  return [...fromCredit, ...fromOrders];
}

export async function getPaymentsMock({
  status,
  method,
  sort = "date",
  order = "desc",
  page,
  pageSize,
}: PaymentFilters): Promise<Paginated<Payment>> {
  await simulateLatency();
  const matching = listPayments().filter(
    (payment) => (!status || payment.status === status) && (!method || payment.method === method),
  );
  return paginate(sortItems(matching, sort, order), page, pageSize);
}

export async function getPaymentMock(id: string): Promise<Payment | null> {
  await simulateLatency();
  return listPayments().find((payment) => payment.id === id) ?? null;
}
