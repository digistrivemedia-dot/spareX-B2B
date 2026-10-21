"use server";

import { revalidatePath } from "next/cache";

import { updateGarageProfile } from "@/features/garage/api";
import type { GarageProfile } from "@/features/garage/types";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

export async function updateGarageProfileAction(
  profile: GarageProfile,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await updateGarageProfile(profile);
    revalidatePath("/garage/profile");
    return null;
  });
}
