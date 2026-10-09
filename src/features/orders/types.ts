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

export type PaymentMethod = "credit" | "online";

/** How an online payment was made. */
export type OnlinePaymentChannel = "upi" | "netbanking" | "card";

/** "pending": a credit order not invoiced yet (invoices are raised at dispatch). */
export type PaymentStatus = "pending" | "due" | "overdue" | "paid" | "cancelled";

export type OrderPayment = {
  method: PaymentMethod;
  status: PaymentStatus;
  /** Online payments only. */
  channel?: OnlinePaymentChannel;
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
  /** The customer's standard price per unit before tier or quotation discounts. */
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
  /** How much tier and quotation pricing saved against list prices. */
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
  payment: { method: "credit" } | { method: "online"; channel: OnlinePaymentChannel };
  items: { productId: string; quantity: number }[];
};

export type PlacedOrder = Pick<Order, "id" | "number">;
