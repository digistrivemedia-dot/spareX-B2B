"use server";

import { revalidatePath } from "next/cache";

import { findVehicleByPlate, type VehicleLookup } from "@/features/customers/api";
import {
  addProgressNote,
  assignTechnician,
  checkIn,
  collectPayment,
  createInvoice,
  createWalkIn,
  finishWork,
  getTechnicianLoad,
  handOver,
  recordApproval,
  recordQualityCheck,
  respondToJob,
  saveInspection,
  sendEstimate,
  sendRevision,
  setLineDone,
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

/** Runs a change to a job, then refreshes the garage pages. Every job action returns nothing. */
function jobChange(change: () => Promise<unknown>): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await change();
    refreshGarage();
    return null;
  });
}

export async function saveInspectionAction(jobId: string, request: InspectionRequest) {
  return jobChange(() => saveInspection(jobId, request));
}

export async function sendEstimateAction(jobId: string, request: EstimateRequest) {
  return jobChange(() => sendEstimate(jobId, request));
}

export async function sendRevisionAction(jobId: string, request: EstimateRequest) {
  return jobChange(() => sendRevision(jobId, request));
}

export async function recordApprovalAction(jobId: string, request: ApprovalRequest) {
  return jobChange(() => recordApproval(jobId, request));
}

export async function getTechnicianLoadAction(
  branchId: string,
): Promise<ActionResult<TechnicianLoad[]>> {
  return toActionResult(() => getTechnicianLoad(branchId));
}

export async function assignTechnicianAction(jobId: string, technicianId: string) {
  return jobChange(() => assignTechnician(jobId, technicianId));
}

export async function respondToJobAction(
  jobId: string,
  response: { accept: true } | { accept: false; reason: string },
) {
  return jobChange(() => respondToJob(jobId, response));
}

export async function setLineDoneAction(jobId: string, lineId: string, isDone: boolean) {
  return jobChange(() => setLineDone(jobId, lineId, isDone));
}

export async function addProgressNoteAction(jobId: string, request: ProgressRequest) {
  return jobChange(() => addProgressNote(jobId, request));
}

export async function finishWorkAction(jobId: string) {
  return jobChange(() => finishWork(jobId));
}

export async function recordQualityCheckAction(jobId: string, request: QualityCheckRequest) {
  return jobChange(() => recordQualityCheck(jobId, request));
}

export async function createInvoiceAction(jobId: string) {
  return jobChange(() => createInvoice(jobId));
}

export async function collectPaymentAction(jobId: string, request: CollectPaymentRequest) {
  return jobChange(() => collectPayment(jobId, request));
}

export async function handOverAction(jobId: string, request: HandoverRequest) {
  return jobChange(() => handOver(jobId, request));
}
