"use server";

import { revalidatePath } from "next/cache";

import { scopeToBranch } from "@/features/auth/permissions";
import { authorizeAction } from "@/features/auth/session";
import { acceptBooking, declineBooking, getBookings } from "@/features/bookings/api";
import type { Booking } from "@/features/bookings/types";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

function refreshBookings(id: string) {
  revalidatePath("/garage", "layout");
  revalidatePath(`/garage/bookings/${id}`);
}

/**
 * New requests waiting for an answer, soonest deadline first, for the alert that pops up on
 * every garage page. Staff see only their own branch's.
 */
export async function getNewBookingRequestsAction(): Promise<ActionResult<Booking[]>> {
  return toActionResult(async () => {
    const session = await authorizeAction("bookings:manage", ["garage"]);
    const { items } = await getBookings({
      status: "new",
      branchId: scopeToBranch(session),
      sort: "respondBy",
      order: "asc",
      pageSize: 10,
    });
    return items;
  });
}

export async function acceptBookingAction(
  id: string,
): Promise<ActionResult<{ jobId: string; jobNumber: string }>> {
  return toActionResult(async () => {
    await authorizeAction("bookings:manage", ["garage"]);
    const job = await acceptBooking(id);
    refreshBookings(id);
    return { jobId: job.id, jobNumber: job.number };
  });
}

export async function declineBookingAction(
  id: string,
  reason: string,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await authorizeAction("bookings:manage", ["garage"]);
    await declineBooking(id, reason);
    refreshBookings(id);
    return null;
  });
}
