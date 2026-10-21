"use server";

import { revalidatePath } from "next/cache";

import { payInvoices } from "@/features/credit/api";
import type { PayInvoicesRequest, PayInvoicesResult } from "@/features/credit/types";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

export async function payInvoicesAction(
  request: PayInvoicesRequest,
): Promise<ActionResult<PayInvoicesResult>> {
  return toActionResult(async () => {
    const result = await payInvoices(request);
    revalidatePath("/credit");
    revalidatePath("/payments");
    revalidatePath("/dashboard");
    return result;
  });
}
