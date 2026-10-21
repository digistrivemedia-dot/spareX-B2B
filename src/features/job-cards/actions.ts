"use server";

import { revalidatePath } from "next/cache";

import { findVehicleByPlate, type VehicleLookup } from "@/features/customers/api";
import { checkIn, createWalkIn } from "@/features/job-cards/api";
import type { CheckInRequest, WalkInRequest } from "@/features/job-cards/types";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

// Every garage screen shows job counts or lists, so a change refreshes the whole section.
const refreshGarage = () => revalidatePath("/garage", "layout");

export async function findVehicleByPlateAction(
  plate: string,
): Promise<ActionResult<VehicleLookup>> {
  return toActionResult(() => findVehicleByPlate(plate));
}

export async function createWalkInAction(
  request: WalkInRequest,
): Promise<ActionResult<{ jobId: string }>> {
  return toActionResult(async () => {
    const job = await createWalkIn(request);
    refreshGarage();
    return { jobId: job.id };
  });
}

export async function checkInAction(
  jobId: string,
  request: CheckInRequest,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await checkIn(jobId, request);
    refreshGarage();
    return null;
  });
}
