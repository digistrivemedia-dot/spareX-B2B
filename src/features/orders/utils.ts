import type { OrderStatus } from "@/features/orders/types";

/** Orders that are placed but not yet delivered or cancelled. */
export const OPEN_ORDER_STATUSES: OrderStatus[] = [
  "placed",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
];
