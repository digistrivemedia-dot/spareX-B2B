"use server";

import { revalidatePath } from "next/cache";

import { rejectQuotation, requestQuotation, requestRevision } from "@/features/quotations/api";
import type { QuotationRequest } from "@/features/quotations/types";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

/** Quotation changes run on the server, then refresh the list and detail pages. */
function refreshQuotation(id: string) {
  revalidatePath("/quotations");
  revalidatePath(`/quotations/${id}`);
}

export async function requestQuotationAction(
  request: QuotationRequest,
): Promise<ActionResult<{ id: string; number: string }>> {
  return toActionResult(async () => {
    const { id, number } = await requestQuotation(request);
    refreshQuotation(id);
    return { id, number };
  });
}

export async function requestRevisionAction(
  id: string,
  comment: string,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await requestRevision(id, comment);
    refreshQuotation(id);
    return null;
  });
}

export async function rejectQuotationAction(
  id: string,
  reason?: string,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await rejectQuotation(id, reason);
    refreshQuotation(id);
    return null;
  });
}
