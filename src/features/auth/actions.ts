"use server";

import { revalidatePath } from "next/cache";

import { registerBusiness, resubmitApplication } from "@/features/auth/api";
import type { RegistrationApplication, RegistrationReceipt } from "@/features/auth/types";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

/**
 * Applications are sent from the server, so the application status page (rendered on the
 * server) sees them straight away.
 */
export async function registerBusinessAction(
  application: RegistrationApplication,
): Promise<ActionResult<RegistrationReceipt>> {
  return toActionResult(() => registerBusiness(application));
}

export async function resubmitApplicationAction(
  ref: string,
  application: RegistrationApplication,
): Promise<ActionResult<RegistrationReceipt>> {
  return toActionResult(async () => {
    const receipt = await resubmitApplication(ref, application);
    revalidatePath("/application");
    return receipt;
  });
}
