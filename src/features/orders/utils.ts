import type { TimelineStep } from "@/components/ui/Timeline";
import type {
  CancellationReason,
  Order,
  OrderStatus,
  PaymentMethod,
  RazorpayChannel,
} from "@/features/orders/types";
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

export const CANCELLATION_REASON_LABELS: Record<CancellationReason, string> = {
  ordered_by_mistake: "Ordered by mistake",
  duplicate: "Duplicate order",
  bought_elsewhere: "Bought the parts elsewhere",
  not_needed: "Parts no longer needed",
  too_slow: "Delivery takes too long",
  other: "Other",
};

/** Until an order ships it can still be cancelled. */
export const CANCELLABLE_STATUSES: OrderStatus[] = ["placed", "confirmed", "processing", "packed"];

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
export function getOrderSteps({ status, timeline, cancellation }: Order): TimelineStep[] {
  const reachedAt = new Map(timeline.map((event) => [event.status, event.at]));

  if (status === "cancelled") {
    return timeline.map((event) =>
      event.status === "cancelled"
        ? {
            label: "Cancelled",
            when: formatDateTime(event.at),
            note: cancellation && CANCELLATION_REASON_LABELS[cancellation.reason],
            state: "stopped",
          }
        : {
            label: ORDER_FLOW.find((step) => step.status === event.status)?.label ?? "Placed",
            when: formatDateTime(event.at),
            state: "done",
          },
    );
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
