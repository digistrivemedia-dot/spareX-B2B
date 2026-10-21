import type { TimelineStep } from "@/components/ui/Timeline";
import type { Order, OrderStatus, PaymentMethod, RazorpayChannel } from "@/features/orders/types";
import { formatDateTime } from "@/lib/format";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  razorpay: "Razorpay",
  bank_transfer: "Bank transfer",
  cod: "Cash on delivery",
  credit: "Credit",
};

export const RAZORPAY_CHANNEL_LABELS: Record<RazorpayChannel, string> = {
  upi: "UPI",
  netbanking: "Net banking",
  card: "Card",
};

/** Orders that are placed but not yet delivered or cancelled. */
export const OPEN_ORDER_STATUSES: OrderStatus[] = [
  "placed",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
];

/** Every step an order goes through, in order. */
const ORDER_FLOW: { status: OrderStatus; label: string }[] = [
  { status: "placed", label: "Placed" },
  { status: "confirmed", label: "Confirmed" },
  { status: "processing", label: "Processing" },
  { status: "packed", label: "Packed" },
  { status: "shipped", label: "Shipped" },
  { status: "out_for_delivery", label: "Out for delivery" },
  { status: "delivered", label: "Delivered" },
];

/** The full delivery journey: steps reached (with times), the current one, and what is left. */
export function getOrderSteps({ status, timeline }: Order): TimelineStep[] {
  const reachedAt = new Map(timeline.map((event) => [event.status, event.at]));

  if (status === "cancelled") {
    return timeline.map((event) => ({
      label: event.status === "cancelled" ? "Cancelled" : "Placed",
      when: formatDateTime(event.at),
      state: event.status === "cancelled" ? "stopped" : "done",
    }));
  }

  return ORDER_FLOW.map(({ status: step, label }) => {
    const at = reachedAt.get(step);
    const isCurrent = step === status && status !== "delivered";
    return {
      label,
      when: at ? formatDateTime(at) : undefined,
      state: isCurrent ? "current" : at ? "done" : "upcoming",
    };
  });
}
