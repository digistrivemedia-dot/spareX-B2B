import type { BranchRef } from "@/features/company/types";
import type { ListParams } from "@/lib/types";

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

/** Kannali marks bank transfers and cash on delivery as paid once the money arrives. */
export type PaymentMethod = "razorpay" | "bank_transfer" | "cod" | "credit";

/** How a Razorpay payment was made. */
export type RazorpayChannel = "upi" | "netbanking" | "card";

/**
 * "pending": not paid and not yet due. That is a credit order before its invoice (raised at
 * dispatch), a bank transfer Kannali hasn't confirmed yet, or cash due on delivery.
 */
export type PaymentStatus = "pending" | "due" | "overdue" | "paid" | "cancelled";

export type OrderPayment = {
  method: PaymentMethod;
  status: PaymentStatus;
  /** Razorpay payments only. */
  channel?: RazorpayChannel;
  /** Bank transfers only: the UTR or reference the buyer gave, if any. */
  transferReference?: string;
  /** Credit orders only: when the invoice falls due. */
  dueDate?: string;
  paidAt?: string;
};

export type OrderLine = {
  productId: string;
  partNumber: string;
  name: string;
  brand: string;
  quantity: number;
  /** Price per unit, excluding GST. */
  unitPriceInPaise: number;
  /** The B2C price per unit, which the business discount and any quoted price are measured against. */
  listPriceInPaise: number;
  gstRatePercent: number;
};

export type OrderEvent = {
  status: OrderStatus;
  at: string;
};

export type OrderInvoice = {
  id: string;
  number: string;
  /** The GST invoice as a PDF. */
  pdfUrl: string;
};

export type Order = {
  id: string;
  number: string;
  poNumber?: string;
  poDate?: string;
  placedAt: string;
  expectedDeliveryDate?: string;
  branch: BranchRef;
  status: OrderStatus;
  itemCount: number;
  items: OrderLine[];
  /** Sum of lines at the prices charged, excluding GST. */
  subtotalInPaise: number;
  /** How much the business discount and any quoted prices saved against B2C prices. */
  savingsInPaise: number;
  gstInPaise: number;
  deliveryInPaise: number;
  totalInPaise: number;
  payment: OrderPayment;
  invoice?: OrderInvoice;
  quotationId?: string;
  notes?: string;
  timeline: OrderEvent[];
};

/** What the order list returns per row. */
export type OrderSummary = Omit<Order, "items" | "timeline">;

export type OrderSort = "placedAt" | "totalInPaise";

export type OrderFilters = ListParams<OrderSort> & {
  /** Matches the order number or your PO number. */
  q?: string;
  statuses?: OrderStatus[];
  branchId?: string;
  /** Placed on or after / on or before these days, as "YYYY-MM-DD" (India time). */
  from?: string;
  to?: string;
};

/** What checkout sends. The server prices the lines itself; the browser never sets prices. */
export type PlaceOrderRequest = {
  branchId: string;
  poNumber?: string;
  poDate?: string;
  notes?: string;
  payment:
    | { method: "razorpay"; channel: RazorpayChannel }
    | { method: "bank_transfer"; transferReference?: string }
    | { method: "cod" }
    | { method: "credit" };
  items: { productId: string; quantity: number }[];
};

export type PlacedOrder = Pick<Order, "id" | "number">;
