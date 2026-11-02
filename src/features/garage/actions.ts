"use server";

import { revalidatePath } from "next/cache";

import { setAcceptingBookings, updateGarageProfile } from "@/features/garage/api";
import { authorizeBranchAction } from "@/features/job-cards/load-job";
import type { GarageProfile } from "@/features/garage/types";
import { authorizeAction } from "@/features/auth/session";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

export async function updateGarageProfileAction(
  profile: GarageProfile,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await authorizeAction("garage:setup", ["garage"]);
    await updateGarageProfile(profile);
    revalidatePath("/garage/profile");
    return null;
  });
}

export async function setAcceptingBookingsAction(
  branchId: string,
  isAccepting: boolean,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await authorizeBranchAction(branchId, "bookings:manage");
    await setAcceptingBookings(branchId, isAccepting);
    // Branches feed the top bar on every page.
    revalidatePath("/", "layout");
    return null;
  });
}
