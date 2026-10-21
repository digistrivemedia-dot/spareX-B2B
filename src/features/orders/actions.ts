"use server";

import { revalidatePath } from "next/cache";

import { cancelOrder, placeOrder } from "@/features/orders/api";
import type { CancelOrderRequest, PlacedOrder, PlaceOrderRequest } from "@/features/orders/types";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

/**
 * Checkout calls this Server Action rather than the API directly, so the order is created on
 * the server: where the confirmation page reads it, and (with real auth) where the session
 * token lives.
 */
export async function placeOrderAction(
  request: PlaceOrderRequest,
): Promise<ActionResult<PlacedOrder>> {
  return toActionResult(async () => {
    const order = await placeOrder(request);
    revalidatePath("/orders");
    if (request.quotationId) revalidatePath(`/quotations/${request.quotationId}`);
    return order;
  });
}

export async function cancelOrderAction(
  id: string,
  request: CancelOrderRequest,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await cancelOrder(id, request);
    revalidatePath("/orders");
    revalidatePath(`/orders/${id}`);
    return null;
  });
}
