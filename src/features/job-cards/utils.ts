import type { TimelineStep } from "@/components/ui/Timeline";
import type { EstimateLine, FuelLevel, JobCard, JobStatus } from "@/features/job-cards/types";
import { formatDateTime } from "@/lib/format";
import { calculateGst } from "@/lib/gst";

/** The main path every job follows, in order. "closed" (no work done) sits outside it. */
export const JOB_FLOW: JobStatus[] = [
  "booked",
  "confirmed",
  "vehicle_received",
  "job_card_created",
  "inspection",
  "awaiting_approval",
  "approved",
  "in_progress",
  "quality_check",
  "ready",
  "payment_pending",
  "paid",
  "completed",
];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  booked: "Booked",
  confirmed: "Confirmed",
  vehicle_received: "Vehicle received",
  job_card_created: "Job card created",
  inspection: "Inspection",
  awaiting_approval: "Waiting for customer approval",
  approved: "Approved",
  in_progress: "Service in progress",
  quality_check: "Quality check",
  ready: "Ready for delivery",
  payment_pending: "Payment pending",
  paid: "Paid",
  completed: "Completed",
  closed: "Closed, no work done",
};

/** Jobs still in the garage's hands. */
export const ACTIVE_JOB_STATUSES = JOB_FLOW.filter(
  (status) => status !== "booked" && status !== "completed",
);

export const FUEL_LEVEL_LABELS: Record<FuelLevel, string> = {
  empty: "Empty",
  quarter: "¼",
  half: "½",
  three_quarters: "¾",
  full: "Full",
};

/** The path so far (side trips included), then the steps still to come. */
export function getJobSteps(job: Pick<JobCard, "status" | "timeline" | "source">): TimelineStep[] {
  const history: TimelineStep[] = job.timeline.map((event, index) => {
    const previous = job.timeline[index - 1];
    const isSideTrip =
      previous && JOB_FLOW.indexOf(event.status) < JOB_FLOW.indexOf(previous.status);
    return {
      label: JOB_STATUS_LABELS[event.status],
      when: formatDateTime(event.at),
      note:
        event.note ??
        (isSideTrip
          ? event.status === "awaiting_approval"
            ? "Extra work found"
            : "Sent back after the quality check"
          : undefined),
      state: event.status === "closed" ? "stopped" : "done",
    };
  });
  if (job.status === "closed" || job.status === "completed") return history;

  // The current status is the last event; mark it current and list what comes after.
  const current = history.at(-1);
  if (current) current.state = "current";
  const upcoming = JOB_FLOW.slice(JOB_FLOW.indexOf(job.status) + 1).map((status): TimelineStep => ({
    label: JOB_STATUS_LABELS[status],
    state: "upcoming",
  }));
  return [...history, ...upcoming];
}

/** Lines that count towards the bill: everything approved. */
export function approvedLines(lines: EstimateLine[]): EstimateLine[] {
  return lines.filter((line) => line.approval === "approved");
}

/** Statuses the dashboard and job list group together, by what the garage is doing. */
export const JOB_STATUS_GROUPS = {
  received: {
    label: "Received",
    statuses: ["vehicle_received", "job_card_created", "inspection"],
  },
  awaiting_approval: { label: "Awaiting approval", statuses: ["awaiting_approval"] },
  in_progress: { label: "In progress", statuses: ["approved", "in_progress", "quality_check"] },
  ready: { label: "Ready", statuses: ["ready"] },
  payment_pending: { label: "Payment pending", statuses: ["payment_pending"] },
} satisfies Record<string, { label: string; statuses: JobStatus[] }>;

export type JobStatusGroup = keyof typeof JOB_STATUS_GROUPS;

type NextAction = { label: string; href: (jobId: string) => string };

/**
 * What the garage does next for a job in each status, with the screen that does it.
 * Statuses without an entry are waiting on someone else (the customer, the technician).
 */
const NEXT_ACTIONS: Partial<Record<JobStatus, NextAction>> = {
  confirmed: { label: "Check in vehicle", href: (id) => `/garage/jobs/${id}/check-in` },
  vehicle_received: { label: "Check in vehicle", href: (id) => `/garage/jobs/${id}/check-in` },
};

export function getNextAction(job: Pick<JobCard, "id" | "status">) {
  const action = NEXT_ACTIONS[job.status];
  return action && { label: action.label, href: action.href(job.id) };
}

export const ESTIMATE_KIND_LABELS: Record<EstimateLine["kind"], string> = {
  labour: "Labour",
  service: "Service",
  part: "Part",
  consumable: "Consumable",
};

export const INSPECTION_RESULT_LABELS = {
  ok: "OK",
  attention: "Needs attention",
  replace: "Replace",
} as const;

/** Net, GST and total of the given lines. GST is worked out per line, as on the invoice. */
export function sumLines(lines: EstimateLine[]) {
  const subtotalInPaise = lines.reduce((sum, l) => sum + l.unitPriceInPaise * l.quantity, 0);
  const gstInPaise = lines.reduce(
    (sum, l) => sum + calculateGst(l.unitPriceInPaise * l.quantity, l.gstRatePercent),
    0,
  );
  return { subtotalInPaise, gstInPaise, totalInPaise: subtotalInPaise + gstInPaise };
}
