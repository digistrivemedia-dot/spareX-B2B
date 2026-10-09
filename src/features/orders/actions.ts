"use server";

import { placeOrder } from "@/features/orders/api";
import type { PlacedOrder, PlaceOrderRequest } from "@/features/orders/types";

/**
 * Checkout calls this Server Action rather than the API directly, so the order is created on
 * the server: where the confirmation page reads it, and (with real auth) where the session
 * token lives.
 */
export async function placeOrderAction(request: PlaceOrderRequest): Promise<PlacedOrder> {
  return placeOrder(request);
}
