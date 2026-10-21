import type { Payment, PaymentRecordStatus } from "@/features/payments/types";
import { PAYMENT_METHOD_LABELS, RAZORPAY_CHANNEL_LABELS } from "@/features/orders/utils";

export const PAYMENT_STATUS_LABELS: Record<PaymentRecordStatus, string> = {
  successful: "Successful",
  awaiting_confirmation: "Awaiting confirmation",
  failed: "Failed",
  refunded: "Refunded",
};

/** "Razorpay · UPI", "Bank transfer", "Cash on delivery". */
export function describeMethod({ method, channel }: Pick<Payment, "method" | "channel">): string {
  const label = PAYMENT_METHOD_LABELS[method];
  return channel ? `${label} · ${RAZORPAY_CHANNEL_LABELS[channel]}` : label;
}

/** Receipts exist for money that actually arrived. */
export function hasReceipt({ status }: Pick<Payment, "status">): boolean {
  return status === "successful" || status === "refunded";
}

export const targetHref = ({ kind, id }: Payment["appliedTo"][number]) =>
  kind === "order" ? `/orders/${id}` : `/credit`;
