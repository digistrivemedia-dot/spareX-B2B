import type { CollectPaymentRequest, HandoverRequest, JobCard } from "@/features/job-cards/types";
import { approvedLines, sumLines } from "@/features/job-cards/utils";
import { ApiError } from "@/lib/api-client";
import { advanceJob, jobCards, requireJob } from "@/mocks/job-cards";
import { currentStaffMock } from "@/mocks/session";
import { simulateLatency } from "@/mocks/utils";

/** The garage's own invoice series, e.g. "SSW/26-27/0152". */
function nextInvoiceNumber(): string {
  const numbers = jobCards.flatMap((job) =>
    job.invoice ? [Number(job.invoice.number.slice(-4))] : [],
  );
  return `SSW/26-27/${String(Math.max(0, ...numbers) + 1).padStart(4, "0")}`;
}

/** Bills the approved work once the vehicle has passed its quality check. */
export async function createInvoiceMock(id: string): Promise<JobCard> {
  await simulateLatency(700);
  const job = requireJob(id);
  if (!job.estimate) throw new ApiError(409, { message: "There's nothing approved to bill." });
  advanceJob(job, ["ready"], "payment_pending");
  job.invoice = {
    number: nextInvoiceNumber(),
    issuedAt: new Date().toISOString(),
    ...sumLines(approvedLines(job.estimate.lines)),
  };
  return job;
}

/** The customer pays the garage online (UPI or payment link) or in cash. */
export async function collectPaymentMock(
  id: string,
  request: CollectPaymentRequest,
): Promise<JobCard> {
  await simulateLatency(700);
  const job = requireJob(id);
  if (!job.invoice) throw new ApiError(409, { message: "Create the invoice first." });
  const amountInPaise = job.invoice.totalInPaise;
  if (request.method === "cash" && request.cashReceivedInPaise < amountInPaise) {
    throw new ApiError(422, { message: "The cash received is less than the bill." });
  }
  advanceJob(job, ["payment_pending"], "paid");
  job.payment = {
    method: request.method,
    amountInPaise,
    receivedAt: new Date().toISOString(),
    receivedBy: await currentStaffMock(),
    reference: request.method === "online" ? request.reference : undefined,
    cashReceivedInPaise: request.method === "cash" ? request.cashReceivedInPaise : undefined,
  };
  return job;
}

/** Handing the vehicle back closes the job. */
export async function handoverMock(id: string, request: HandoverRequest): Promise<JobCard> {
  await simulateLatency(700);
  const job = requireJob(id);
  if (request.checklist.some((item) => !item.isDone)) {
    throw new ApiError(422, { message: "Tick every handover step first." });
  }
  if (job.checkIn && request.odometerKm < job.checkIn.odometerKm) {
    throw new ApiError(422, { message: "The odometer can't be lower than at check-in." });
  }
  advanceJob(job, ["paid"], "completed");
  const { nextService, ...handover } = request;
  job.handover = { ...handover, at: new Date().toISOString(), by: await currentStaffMock() };
  job.nextService = nextService;
  return job;
}
