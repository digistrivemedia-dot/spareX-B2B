import type { PaymentMethod, RazorpayChannel } from "@/features/orders/types";
import type { ListParams } from "@/lib/types";

export type PaymentRecordStatus = "successful" | "awaiting_confirmation" | "failed" | "refunded";

/** What a payment settled: an order paid up front, or credit invoices. */
export type PaymentTarget = {
  kind: "order" | "invoice";
  id: string;
  number: string;
  amountInPaise: number;
};

export type Payment = {
  id: string;
  date: string;
  method: PaymentMethod;
  /** Razorpay payments only. */
  channel?: RazorpayChannel;
  /** The Razorpay payment ID, bank UTR or UPI reference. */
  reference?: string;
  amountInPaise: number;
  appliedTo: PaymentTarget[];
  status: PaymentRecordStatus;
};

export type PaymentFilters = ListParams<"date"> & {
  status?: PaymentRecordStatus;
  method?: PaymentMethod;
};
