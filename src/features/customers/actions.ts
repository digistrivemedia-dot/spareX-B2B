"use server";

import { revalidatePath } from "next/cache";

import { addCustomer } from "@/features/customers/api";
import type { NewCustomerRequest } from "@/features/customers/types";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

export async function addCustomerAction(
  request: NewCustomerRequest,
): Promise<ActionResult<{ id: string }>> {
  return toActionResult(async () => {
    const created = await addCustomer(request);
    revalidatePath("/garage/customers");
    return created;
  });
}
