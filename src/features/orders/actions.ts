"use server";

import { revalidatePath } from "next/cache";

import { cancelOrder, getOrder, placeOrder } from "@/features/orders/api";
import type { CancelOrderRequest, PlacedOrder, PlaceOrderRequest } from "@/features/orders/types";
import { authorizeAction } from "@/features/auth/session";
import { toActionResult } from "@/lib/actions";
import { ApiError } from "@/lib/api-client";
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
    await authorizeAction("orders:place");
    const order = await placeOrder(request);
    revalidatePath("/orders");
    if (request.quotationId) revalidatePath(`/quotations/${request.quotationId}`);
    return order;
  });
}

/** The parts and quantities of an order, to add to the cart again. */
export async function getReorderItemsAction(
  id: string,
): Promise<ActionResult<{ productId: string; quantity: number }[]>> {
  return toActionResult(async () => {
    await authorizeAction("orders:place");
    const order = await getOrder(id);
    if (!order) throw new ApiError(404, { message: "We couldn't find that order." });
    return order.items.map(({ productId, quantity }) => ({ productId, quantity }));
  });
}

export async function cancelOrderAction(
  id: string,
  request: CancelOrderRequest,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await authorizeAction("orders:place");
    await cancelOrder(id, request);
    revalidatePath("/orders");
    revalidatePath(`/orders/${id}`);
    return null;
  });
}
