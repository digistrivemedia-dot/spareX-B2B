"use server";

import { revalidatePath } from "next/cache";

import { acceptBooking, declineBooking } from "@/features/bookings/api";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

function refreshBookings(id: string) {
  revalidatePath("/garage", "layout");
  revalidatePath(`/garage/bookings/${id}`);
}

export async function acceptBookingAction(id: string): Promise<ActionResult<{ jobId: string }>> {
  return toActionResult(async () => {
    const job = await acceptBooking(id);
    refreshBookings(id);
    return { jobId: job.id };
  });
}

export async function declineBookingAction(
  id: string,
  reason: string,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await declineBooking(id, reason);
    refreshBookings(id);
    return null;
  });
}
