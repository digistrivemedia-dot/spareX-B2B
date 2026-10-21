import type {
  ApprovalRequest,
  CheckInRequest,
  CollectPaymentRequest,
  HandoverRequest,
  EstimateRequest,
  InspectionRequest,
  ProgressRequest,
  QualityCheckRequest,
  JobCard,
  JobCardFilters,
  JobCardSummary,
  WalkInRequest,
} from "@/features/job-cards/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import { checkInMock, createWalkInMock, getJobCardMock, getJobCardsMock } from "@/mocks/job-cards";
import {
  addProgressNoteMock,
  assignTechnicianMock,
  finishWorkMock,
  getTechnicianLoadMock,
  recordApprovalMock,
  recordQualityCheckMock,
  respondToJobMock,
  saveInspectionMock,
  sendEstimateMock,
  sendRevisionMock,
  setLineDoneMock,
} from "@/mocks/job-card-work";
import { collectPaymentMock, createInvoiceMock, handoverMock } from "@/mocks/job-card-billing";

export async function getJobCards(
  filters: JobCardFilters = {},
): Promise<Paginated<JobCardSummary>> {
  if (dataSource.jobCards === "mock") return getJobCardsMock(filters);
  const { statuses, ...params } = filters;
  return apiClient<Paginated<JobCardSummary>>("/garage/jobs", {
    query: { ...params, statuses: statuses?.join(",") },
  });
}

/** One job card with everything done on it so far, or null if there is none. */
export async function getJobCard(id: string): Promise<JobCard | null> {
  if (dataSource.jobCards === "mock") return getJobCardMock(id);
  return apiClient<JobCard | null>(`/garage/jobs/${id}`);
}

/** Opens a job for a vehicle that arrived without a booking. */
export async function createWalkIn(request: WalkInRequest): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return createWalkInMock(request);
  return apiClient<JobCard>("/garage/jobs", { method: "POST", body: request });
}

/** Records the vehicle's condition on arrival; the job card is then open for work. */
export async function checkIn(id: string, request: CheckInRequest): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return checkInMock(id, request);
  return apiClient<JobCard>(`/garage/jobs/${id}/check-in`, { method: "POST", body: request });
}

export async function saveInspection(id: string, request: InspectionRequest): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return saveInspectionMock(id, request);
  return apiClient<JobCard>(`/garage/jobs/${id}/inspection`, { method: "PUT", body: request });
}

/** Sends the first estimate to the customer for approval. */
export async function sendEstimate(id: string, request: EstimateRequest): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return sendEstimateMock(id, request);
  return apiClient<JobCard>(`/garage/jobs/${id}/estimate`, { method: "POST", body: request });
}

/** Adds extra work to an approved estimate and sends it back to the customer. */
export async function sendRevision(id: string, request: EstimateRequest): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return sendRevisionMock(id, request);
  return apiClient<JobCard>(`/garage/jobs/${id}/estimate/revision`, {
    method: "POST",
    body: request,
  });
}

export async function recordApproval(id: string, request: ApprovalRequest): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return recordApprovalMock(id, request);
  return apiClient<JobCard>(`/garage/jobs/${id}/estimate/approval`, {
    method: "POST",
    body: request,
  });
}

export type TechnicianLoad = { id: string; name: string; activeJobs: number };

/** The branch's technicians and how many jobs each has on now. */
export async function getTechnicianLoad(branchId: string): Promise<TechnicianLoad[]> {
  if (dataSource.jobCards === "mock") return getTechnicianLoadMock(branchId);
  return apiClient<TechnicianLoad[]>("/garage/technicians", { query: { branchId } });
}

export async function assignTechnician(id: string, technicianId: string): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return assignTechnicianMock(id, technicianId);
  return apiClient<JobCard>(`/garage/jobs/${id}/technician`, {
    method: "PUT",
    body: { technicianId },
  });
}

/** The assigned technician accepts the job, or hands it back with a reason. */
export async function respondToJob(
  id: string,
  response: { accept: true } | { accept: false; reason: string },
): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return respondToJobMock(id, response);
  return apiClient<JobCard>(`/garage/jobs/${id}/response`, { method: "POST", body: response });
}

export async function setLineDone(id: string, lineId: string, isDone: boolean): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return setLineDoneMock(id, lineId, isDone);
  return apiClient<JobCard>(`/garage/jobs/${id}/lines/${lineId}`, {
    method: "PATCH",
    body: { isDone },
  });
}

export async function addProgressNote(id: string, request: ProgressRequest): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return addProgressNoteMock(id, request);
  return apiClient<JobCard>(`/garage/jobs/${id}/progress`, { method: "POST", body: request });
}

/** The technician's work is done: on to the quality check. */
export async function finishWork(id: string): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return finishWorkMock(id);
  return apiClient<JobCard>(`/garage/jobs/${id}/finish`, { method: "POST" });
}

export async function recordQualityCheck(
  id: string,
  request: QualityCheckRequest,
): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return recordQualityCheckMock(id, request);
  return apiClient<JobCard>(`/garage/jobs/${id}/quality-check`, { method: "POST", body: request });
}

/** Bills the approved work once the vehicle has passed its quality check. */
export async function createInvoice(id: string): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return createInvoiceMock(id);
  return apiClient<JobCard>(`/garage/jobs/${id}/invoice`, { method: "POST" });
}

export async function collectPayment(id: string, request: CollectPaymentRequest): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return collectPaymentMock(id, request);
  return apiClient<JobCard>(`/garage/jobs/${id}/payment`, { method: "POST", body: request });
}

/** Hands the vehicle back to the customer, which completes the job. */
export async function handOver(id: string, request: HandoverRequest): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return handoverMock(id, request);
  return apiClient<JobCard>(`/garage/jobs/${id}/handover`, { method: "POST", body: request });
}
