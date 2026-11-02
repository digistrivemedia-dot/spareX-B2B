"use server";

import { revalidatePath } from "next/cache";

import { createReturn } from "@/features/returns/api";
import type { CreateReturnRequest } from "@/features/returns/types";
import { authorizeAction } from "@/features/auth/session";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

export async function createReturnAction(
  request: CreateReturnRequest,
): Promise<ActionResult<{ id: string; number: string }>> {
  return toActionResult(async () => {
    await authorizeAction("orders:place");
    const { id, number } = await createReturn(request);
    revalidatePath("/returns");
    revalidatePath(`/orders/${request.orderId}`);
    return { id, number };
  });
}
