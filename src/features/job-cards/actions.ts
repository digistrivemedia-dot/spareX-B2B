"use server";

import { revalidatePath } from "next/cache";

import { findVehicleByPlate, type VehicleLookup } from "@/features/customers/api";
import {
  addProgressNote,
  assignDriver,
  assignTechnician,
  checkIn,
  collectPayment,
  createInvoice,
  createWalkIn,
  finishWork,
  getBranchStaff,
  getTechnicianLoad,
  handOver,
  recordApproval,
  recordQualityCheck,
  respondToJob,
  saveInspection,
  sendEstimate,
  sendRevision,
  setLineDone,
  type DriverLoad,
  type TechnicianLoad,
} from "@/features/job-cards/api";
import type {
  ApprovalRequest,
  CheckInRequest,
  CollectPaymentRequest,
  EstimateRequest,
  HandoverRequest,
  InspectionRequest,
  ProgressRequest,
  QualityCheckRequest,
  WalkInRequest,
} from "@/features/job-cards/types";
import { authorizeAction } from "@/features/auth/session";
import type { Permission } from "@/features/auth/permissions";
import { authorizeBranchAction, authorizeJobAction } from "@/features/job-cards/load-job";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

// Every garage screen shows job counts or lists, so a change refreshes the whole section.
const refreshGarage = () => revalidatePath("/garage", "layout");

export async function findVehicleByPlateAction(
  plate: string,
): Promise<ActionResult<VehicleLookup>> {
  return toActionResult(async () => {
    await authorizeAction("jobs:manage", ["garage"]);
    return findVehicleByPlate(plate);
  });
}

export async function createWalkInAction(
  request: WalkInRequest,
): Promise<ActionResult<{ jobId: string }>> {
  return toActionResult(async () => {
    await authorizeBranchAction(request.branchId, "jobs:manage");
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
    // The driver records the pick-up with the same check-in, at the customer's door.
    await authorizeJobAction(jobId, "jobs:manage", "pickup");
    await checkIn(jobId, request);
    refreshGarage();
    return null;
  });
}

/**
 * Checks the caller may make this change to this job, makes it, then refreshes the garage pages.
 * Every job action returns nothing.
 */
function jobChange(
  jobId: string,
  permission: Permission,
  change: () => Promise<unknown>,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await authorizeJobAction(jobId, permission);
    await change();
    refreshGarage();
    return null;
  });
}

export async function saveInspectionAction(jobId: string, request: InspectionRequest) {
  return jobChange(jobId, "jobs:inspect", () => saveInspection(jobId, request));
}

export async function sendEstimateAction(jobId: string, request: EstimateRequest) {
  return jobChange(jobId, "jobs:manage", () => sendEstimate(jobId, request));
}

export async function sendRevisionAction(jobId: string, request: EstimateRequest) {
  return jobChange(jobId, "jobs:manage", () => sendRevision(jobId, request));
}

export async function recordApprovalAction(jobId: string, request: ApprovalRequest) {
  return jobChange(jobId, "jobs:manage", () => recordApproval(jobId, request));
}

export async function getTechnicianLoadAction(
  branchId: string,
): Promise<ActionResult<TechnicianLoad[]>> {
  return toActionResult(async () => {
    await authorizeBranchAction(branchId, "jobs:manage");
    return getTechnicianLoad(branchId);
  });
}

export async function assignTechnicianAction(jobId: string, technicianId: string) {
  return jobChange(jobId, "jobs:manage", () => assignTechnician(jobId, technicianId));
}

export async function respondToJobAction(
  jobId: string,
  response: { accept: true } | { accept: false; reason: string },
) {
  return jobChange(jobId, "jobs:work", () => respondToJob(jobId, response));
}

export async function setLineDoneAction(jobId: string, lineId: string, isDone: boolean) {
  return jobChange(jobId, "jobs:work", () => setLineDone(jobId, lineId, isDone));
}

export async function addProgressNoteAction(jobId: string, request: ProgressRequest) {
  return jobChange(jobId, "jobs:work", () => addProgressNote(jobId, request));
}

export async function finishWorkAction(jobId: string) {
  return jobChange(jobId, "jobs:work", () => finishWork(jobId));
}

export async function recordQualityCheckAction(jobId: string, request: QualityCheckRequest) {
  return jobChange(jobId, "jobs:qa", () => recordQualityCheck(jobId, request));
}

export async function createInvoiceAction(jobId: string) {
  return jobChange(jobId, "jobs:billing", () => createInvoice(jobId));
}

export async function collectPaymentAction(jobId: string, request: CollectPaymentRequest) {
  return jobChange(jobId, "jobs:billing", () => collectPayment(jobId, request));
}

export async function handOverAction(
  jobId: string,
  request: HandoverRequest,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    // The driver hands a delivered vehicle over at the customer's door.
    await authorizeJobAction(jobId, "jobs:deliver", "drop");
    await handOver(jobId, request);
    refreshGarage();
    return null;
  });
}

export async function getBranchStaffAction(branchId: string): Promise<ActionResult<DriverLoad[]>> {
  return toActionResult(async () => {
    await authorizeBranchAction(branchId, "jobs:view");
    return getBranchStaff(branchId);
  });
}

/** The manager sends someone on the pick-up; whoever delivers vehicles sends the drop. */
export async function assignDriverAction(jobId: string, trip: "pickup" | "drop", driverId: string) {
  return jobChange(jobId, trip === "pickup" ? "jobs:manage" : "jobs:deliver", () =>
    assignDriver(jobId, trip, driverId),
  );
}
