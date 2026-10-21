import type {
  ApprovalRequest,
  EstimateRequest,
  InspectionRequest,
  JobCard,
  ProgressRequest,
  QualityCheckRequest,
} from "@/features/job-cards/types";
import { TECHNICIAN_STATUSES } from "@/features/job-cards/utils";
import { ApiError } from "@/lib/api-client";
import { companyUsers } from "@/mocks/company";
import { advanceJob, jobCards, requireJob } from "@/mocks/job-cards";
import { currentStaffMock } from "@/mocks/session";
import { simulateLatency } from "@/mocks/utils";

const now = () => new Date().toISOString();

/** Saving the inspection moves the job on to "Inspection" (done), ready for an estimate. */
export async function saveInspectionMock(
  id: string,
  { items }: InspectionRequest,
): Promise<JobCard> {
  await simulateLatency(700);
  const job = requireJob(id);
  if (job.status === "job_card_created") advanceJob(job, ["job_card_created"], "inspection");
  else if (job.status !== "inspection") {
    throw new ApiError(409, { message: "This job is past its inspection." });
  }
  job.inspection = { at: now(), by: await currentStaffMock(), items };
  return job;
}

/** Sends the first estimate to the customer. */
export async function sendEstimateMock(id: string, { lines }: EstimateRequest): Promise<JobCard> {
  await simulateLatency(700);
  const job = requireJob(id);
  if (lines.length === 0) throw new ApiError(422, { message: "Add at least one line." });
  advanceJob(job, ["inspection"], "awaiting_approval");
  job.estimate = {
    lines: lines.map((line) => ({ ...line, approval: "pending", isExtra: false })),
    sentAt: now(),
  };
  return job;
}

/** Adds extra work found during the service and sends it back to the customer. */
export async function sendRevisionMock(id: string, { lines }: EstimateRequest): Promise<JobCard> {
  await simulateLatency(700);
  const job = requireJob(id);
  if (!job.estimate) throw new ApiError(409, { message: "This job has no estimate yet." });
  if (lines.length === 0) throw new ApiError(422, { message: "Add the extra work first." });
  advanceJob(job, ["approved", "in_progress"], "awaiting_approval", "Extra work found");
  job.estimate.lines.push(
    ...lines.map((line) => ({ ...line, approval: "pending" as const, isExtra: true })),
  );
  job.estimate.sentAt = now();
  return job;
}

/**
 * Records the customer's answer. If they turn everything down on a first estimate the job closes
 * with no fee; extra work turned down just lets the original work carry on.
 */
export async function recordApprovalMock(
  id: string,
  { decisions, note }: ApprovalRequest,
): Promise<JobCard> {
  await simulateLatency(700);
  const job = requireJob(id);
  if (!job.estimate) throw new ApiError(409, { message: "This job has no estimate yet." });
  const pending = job.estimate.lines.filter((line) => line.approval === "pending");
  if (pending.some((line) => !decisions[line.id])) {
    throw new ApiError(422, { message: "Record an answer for every line." });
  }
  for (const line of pending) line.approval = decisions[line.id];
  Object.assign(job.estimate, { approvalNote: note, decidedAt: now() });

  const wasStarted = job.timeline.some((event) => event.status === "in_progress");
  const anyApproved = job.estimate.lines.some((line) => line.approval === "approved");
  if (!anyApproved) {
    advanceJob(job, ["awaiting_approval"], "closed", "Customer turned down the estimate");
  } else {
    advanceJob(job, ["awaiting_approval"], wasStarted ? "in_progress" : "approved");
  }
  return job;
}

/** Assigning (or reassigning) waits for the technician to accept in "My jobs". */
export async function assignTechnicianMock(id: string, technicianId: string): Promise<JobCard> {
  await simulateLatency(500);
  const job = requireJob(id);
  const technician = companyUsers.find(
    (user) => user.id === technicianId && user.roles.includes("technician"),
  );
  if (!technician) throw new ApiError(422, { message: "Choose a technician." });
  if (technician.branchId !== job.branch.id) {
    throw new ApiError(422, { message: "Technicians can only work on their own branch's jobs." });
  }
  job.technician = { id: technician.id, name: technician.name };
  // A reassigned job in progress waits for the new technician to accept it.
  if (job.status === "in_progress") advanceJob(job, ["in_progress"], "approved", "Reassigned");
  return job;
}

/** How many jobs each technician has on now, to spread the work when assigning. */
export async function getTechnicianLoadMock(branchId: string) {
  await simulateLatency(200);
  return companyUsers
    .filter((user) => user.roles.includes("technician") && user.branchId === branchId)
    .filter((user) => user.status !== "disabled")
    .map((user) => ({
      id: user.id,
      name: user.name,
      activeJobs: jobCards.filter(
        (job) => job.technician?.id === user.id && TECHNICIAN_STATUSES.includes(job.status),
      ).length,
    }));
}

/** The job's technician only. */
async function requireOwnJob(id: string): Promise<JobCard> {
  const job = requireJob(id);
  const me = await currentStaffMock();
  if (job.technician?.id !== me.id) {
    throw new ApiError(403, { message: "This job is assigned to someone else." });
  }
  return job;
}

export async function respondToJobMock(
  id: string,
  response: { accept: true } | { accept: false; reason: string },
): Promise<JobCard> {
  await simulateLatency(500);
  const job = await requireOwnJob(id);
  if (response.accept) {
    advanceJob(job, ["approved"], "in_progress", `Accepted by ${job.technician?.name}`);
  } else {
    if (job.status !== "approved") throw new ApiError(409, { message: "This job has started." });
    job.timeline.push({
      status: "approved",
      at: now(),
      note: `${job.technician?.name} couldn't take it: ${response.reason}`,
    });
    job.technician = undefined;
  }
  return job;
}

/** Ticks a work line or part off (or back on). */
export async function setLineDoneMock(
  id: string,
  lineId: string,
  isDone: boolean,
): Promise<JobCard> {
  await simulateLatency(250);
  const job = await requireOwnJob(id);
  const line = job.estimate?.lines.find((candidate) => candidate.id === lineId);
  if (!line || line.approval !== "approved") throw new ApiError(404, { message: "No such task." });
  if (job.status !== "in_progress")
    throw new ApiError(409, { message: "This job isn't in progress." });
  line.isDone = isDone;
  return job;
}

export async function addProgressNoteMock(id: string, request: ProgressRequest): Promise<JobCard> {
  await simulateLatency(500);
  const job = await requireOwnJob(id);
  job.progress.push({
    ...request,
    id: `${id}-note-${Date.now()}`,
    at: now(),
    by: await currentStaffMock(),
  });
  return job;
}

/** Hands the vehicle to the quality check once every approved line is done. */
export async function finishWorkMock(id: string): Promise<JobCard> {
  await simulateLatency(500);
  const job = await requireOwnJob(id);
  const open = job.estimate?.lines.filter((line) => line.approval === "approved" && !line.isDone);
  if (open?.length) throw new ApiError(422, { message: "Tick off every task and part first." });
  advanceJob(job, ["in_progress"], "quality_check");
  return job;
}

/** Pass moves the job to "Ready for delivery"; rework sends it back to the technician. */
export async function recordQualityCheckMock(
  id: string,
  request: QualityCheckRequest,
): Promise<JobCard> {
  await simulateLatency(600);
  const job = requireJob(id);
  if (request.result === "rework" && !request.note) {
    throw new ApiError(422, { message: "Say what needs redoing." });
  }
  const isPass = request.result === "pass";
  advanceJob(
    job,
    ["quality_check"],
    isPass ? "ready" : "in_progress",
    isPass ? undefined : request.note,
  );
  job.qualityChecks.push({ ...request, at: now(), by: await currentStaffMock() });
  if (!isPass && job.estimate) {
    // The technician re-checks the work lines that failed.
    for (const line of job.estimate.lines) if (line.kind !== "part") line.isDone = false;
  }
  return job;
}
