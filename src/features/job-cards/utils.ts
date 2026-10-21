import type { TimelineStep } from "@/components/ui/Timeline";
import type { Permission } from "@/features/auth/permissions";
import type { EstimateLineValues } from "@/features/job-cards/schemas";
import type {
  EstimateLine,
  EstimateLineInput,
  FuelLevel,
  JobCard,
  JobStatus,
} from "@/features/job-cards/types";
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

type NextAction = { label: string; page: string; permission: Permission };

/**
 * What the garage does next for a job in each status, the job card page that does it, and who
 * may do it. Statuses without an entry are waiting on someone else (the customer, the technician).
 */
const NEXT_ACTIONS: Partial<Record<JobStatus, NextAction>> = {
  confirmed: { label: "Check in vehicle", page: "check-in", permission: "jobs:manage" },
  vehicle_received: { label: "Check in vehicle", page: "check-in", permission: "jobs:manage" },
  job_card_created: { label: "Inspect vehicle", page: "inspection", permission: "jobs:inspect" },
  inspection: { label: "Build estimate", page: "estimate", permission: "jobs:manage" },
  awaiting_approval: {
    label: "Record customer's answer",
    page: "estimate",
    permission: "jobs:manage",
  },
  quality_check: { label: "Do quality check", page: "quality-check", permission: "jobs:qa" },
  ready: { label: "Create invoice", page: "invoice", permission: "jobs:billing" },
  payment_pending: { label: "Collect payment", page: "invoice", permission: "jobs:billing" },
  paid: { label: "Hand over vehicle", page: "handover", permission: "jobs:billing" },
};

export type JobAction = {
  /** "assign" opens the assign-technician dialog on the job card instead of a page. */
  kind: "link" | "assign";
  label: string;
  href: string;
  permission: Permission;
};

export function getNextAction(
  job: Pick<JobCard, "id" | "status" | "technician">,
): JobAction | undefined {
  if (job.status === "approved" && !job.technician) {
    return {
      kind: "assign",
      label: "Assign technician",
      href: `/garage/jobs/${job.id}`,
      permission: "jobs:manage",
    };
  }
  const action = NEXT_ACTIONS[job.status];
  return (
    action && {
      kind: "link",
      label: action.label,
      href: `/garage/jobs/${job.id}/${action.page}`,
      permission: action.permission,
    }
  );
}

/** Statuses in which a technician is (or can be) working on the job. */
export const TECHNICIAN_STATUSES: JobStatus[] = ["approved", "in_progress", "quality_check"];

/** The inspection checklist, by area. Every item starts as OK. */
export const INSPECTION_CHECKLIST: { area: string; items: string[] }[] = [
  { area: "Engine", items: ["Engine oil level and colour", "Oil leaks", "Idling and pick-up"] },
  { area: "Brakes", items: ["Front brake", "Rear brake", "Brake fluid"] },
  { area: "Electricals", items: ["Lights and indicators", "Horn", "Battery and self start"] },
  {
    area: "Tyres and wheels",
    items: ["Front tyre tread and pressure", "Rear tyre tread and pressure", "Wheel bearings"],
  },
  { area: "Chain and transmission", items: ["Chain slack and wear", "Clutch play"] },
  {
    area: "Suspension and body",
    items: ["Front forks", "Rear shock absorbers", "Mirrors and side stand"],
  },
];

/** Standard quality checks, after the job's own work lines. */
export const QUALITY_CHECKLIST = [
  "Road test done",
  "No oil or fuel leaks",
  "Brakes bite evenly",
  "Old parts kept for the customer",
  "Vehicle washed and cleaned",
];

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

/** An empty estimate line of the given kind. */
export function newEstimateLine(kind: EstimateLine["kind"] = "labour"): EstimateLineValues {
  return {
    id: `line-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    kind,
    description: "",
    partNumber: "",
    quantity: "1",
    price: "",
    gst: "18",
  };
}

/** The builder's string fields → the line the API takes. */
export function toLineInput(values: EstimateLineValues): EstimateLineInput {
  return {
    id: values.id,
    kind: values.kind,
    description: values.description,
    partNumber: values.partNumber || undefined,
    quantity: Number(values.quantity),
    unitPriceInPaise: Math.round(Number(values.price) * 100),
    gstRatePercent: Number(values.gst),
  };
}
