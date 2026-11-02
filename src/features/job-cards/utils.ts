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

/**
 * The main path every job follows, in order. "closed" (no work done) sits outside it. The two
 * trips (out for pick-up, out for delivery) happen only for pick-up & drop bookings.
 */
export const JOB_FLOW: JobStatus[] = [
  "booked",
  "confirmed",
  "out_for_pickup",
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
  "out_for_delivery",
  "completed",
];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  booked: "Booked",
  confirmed: "Confirmed",
  out_for_pickup: "Out for pick-up",
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
  out_for_delivery: "Out for delivery",
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

/**
 * What has happened so far, side trips included, each step ticked. What's still to come is on
 * the stage strip at the top of the job card.
 */
export function getJobSteps(job: Pick<JobCard, "status" | "timeline" | "source">): TimelineStep[] {
  const history: TimelineStep[] = job.timeline.map((event, index) => {
    const previous = job.timeline[index - 1];
    const isSideTrip =
      previous &&
      (event.status === "awaiting_approval" || event.status === "in_progress") &&
      JOB_FLOW.indexOf(event.status) < JOB_FLOW.indexOf(previous.status);
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
  return history;
}

/** The stages of the work, in order, as the job card shows them with a tick each. */
const JOB_STAGES = [
  { key: "check_in", label: "Check-in" },
  { key: "inspection", label: "Inspection" },
  { key: "estimate", label: "Estimate" },
  { key: "approval", label: "Approval" },
  { key: "service", label: "Service" },
  { key: "quality_check", label: "Quality check" },
  { key: "invoice", label: "Invoice" },
  { key: "payment", label: "Payment" },
  { key: "handover", label: "Handover" },
] as const;

export type JobStage = "pickup" | (typeof JOB_STAGES)[number]["key"];

/** A pick-up & drop job starts with the pick-up, and its handover is the delivery. */
export function getJobStages(job: Pick<JobCard, "pickupDrop">): { key: JobStage; label: string }[] {
  if (!job.pickupDrop) return [...JOB_STAGES];
  return [
    { key: "pickup", label: "Pick-up" },
    ...JOB_STAGES.map((stage) =>
      stage.key === "handover" ? { ...stage, label: "Delivery" } : stage,
    ),
  ];
}

/**
 * The stages a job has finished. The status alone can't tell, because extra work and rework send
 * a job back, so each stage is read from its own record.
 */
export function getFinishedStages(job: JobCard): Set<JobStage> {
  const lines = job.estimate?.lines ?? [];
  const isPast = (status: JobStatus) =>
    job.status !== "closed" && JOB_FLOW.indexOf(job.status) >= JOB_FLOW.indexOf(status);
  const finished: Record<JobStage, boolean> = {
    pickup: Boolean(job.pickupDrop?.pickup?.doneAt),
    check_in: Boolean(job.checkIn),
    inspection: Boolean(job.inspection),
    estimate: Boolean(job.estimate),
    approval: lines.length > 0 && lines.every((line) => line.approval !== "pending"),
    service: isPast("quality_check"),
    quality_check: isPast("ready"),
    invoice: Boolean(job.invoice),
    payment: Boolean(job.payment),
    handover: Boolean(job.handover),
  };
  return new Set(
    getJobStages(job)
      .map(({ key }) => key)
      .filter((key) => finished[key]),
  );
}

/** Lines that count towards the bill: everything approved. */
export function approvedLines(lines: EstimateLine[]): EstimateLine[] {
  return lines.filter((line) => line.approval === "approved");
}

/**
 * The job list's tabs and the dashboard's counts: the statuses grouped and named after what the
 * garage does next, so nobody has to know the thirteen statuses.
 */
export const JOB_STATUS_GROUPS = {
  arriving: {
    label: "Arriving",
    description: "Booking accepted, vehicle not here yet",
    statuses: ["confirmed"],
  },
  on_the_road: {
    label: "On the road",
    description: "A driver is picking up or delivering",
    statuses: ["out_for_pickup", "out_for_delivery"],
  },
  to_estimate: {
    label: "To inspect & estimate",
    description: "In the garage, estimate not sent yet",
    statuses: ["vehicle_received", "job_card_created", "inspection"],
  },
  awaiting_approval: {
    label: "Waiting for customer",
    description: "Estimate sent, waiting for their yes or no",
    statuses: ["awaiting_approval"],
  },
  servicing: {
    label: "Servicing",
    description: "Approved, being serviced or quality-checked",
    statuses: ["approved", "in_progress", "quality_check"],
  },
  ready: {
    label: "To bill",
    description: "Passed the quality check, invoice to make",
    statuses: ["ready"],
  },
  payment_pending: {
    label: "Awaiting payment",
    description: "Invoiced, not paid yet",
    statuses: ["payment_pending"],
  },
  paid: {
    label: "To hand over",
    description: "Paid, vehicle to give back",
    statuses: ["paid"],
  },
} satisfies Record<string, { label: string; description: string; statuses: JobStatus[] }>;

export type JobStatusGroup = keyof typeof JOB_STATUS_GROUPS;

/** The group (tab) a status falls under; completed and closed jobs are in none. */
export function getStatusGroup(status: JobStatus): JobStatusGroup | undefined {
  return (Object.keys(JOB_STATUS_GROUPS) as JobStatusGroup[]).find((group) =>
    (JOB_STATUS_GROUPS[group].statuses as JobStatus[]).includes(status),
  );
}

/** What a job is waiting for, shown to people who can't take its next step themselves. */
export function getWaitingNote(job: Pick<JobCard, "status" | "technician" | "pickupDrop">): string {
  const technician = job.technician?.name.split(" ")[0];
  const pickupDriver = job.pickupDrop?.pickup?.driver.name.split(" ")[0];
  const dropDriver = job.pickupDrop?.drop?.driver.name.split(" ")[0];
  const notes: Record<JobStatus, string> = {
    booked: "Waiting for the booking to be accepted",
    confirmed: job.pickupDrop
      ? "Waiting for a pick-up driver"
      : "Waiting for the vehicle to arrive",
    out_for_pickup: pickupDriver ? `${pickupDriver} is picking it up` : "Being picked up",
    vehicle_received: "Waiting for check-in",
    job_card_created: "Waiting for inspection",
    inspection: "Waiting for the estimate",
    awaiting_approval: "Waiting for the customer",
    approved: technician ? `Waiting for ${technician} to accept` : "Waiting for a technician",
    in_progress: technician ? `${technician} is working on it` : "Being serviced",
    quality_check: "Waiting for quality check",
    ready: "Waiting for billing",
    payment_pending: "Waiting for payment",
    paid: job.pickupDrop ? "Waiting for a delivery driver" : "Waiting for handover",
    out_for_delivery: dropDriver ? `${dropDriver} is delivering it` : "Being delivered",
    completed: "Handed over",
    closed: "No work done",
  };
  return notes[job.status];
}

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
  ready: { label: "Bill the customer", page: "invoice", permission: "jobs:billing" },
  payment_pending: { label: "Collect payment", page: "invoice", permission: "jobs:billing" },
  paid: { label: "Hand over vehicle", page: "handover", permission: "jobs:deliver" },
};

export type JobAction = {
  /**
   * "assign" opens the assign-technician dialog on the job card instead of a page; "driver" opens
   * the assign-driver dialog for the trip.
   */
  kind: "link" | "assign" | "driver";
  trip?: "pickup" | "drop";
  label: string;
  href: string;
  permission: Permission;
};

/** Pick-up & drop jobs: assign a driver, then record the pick-up or the delivery. */
function getTripAction(job: Pick<JobCard, "id" | "status" | "pickupDrop">): JobAction | undefined {
  const trips = job.pickupDrop;
  if (!trips) return undefined;
  const jobPage = `/garage/jobs/${job.id}`;
  if (job.status === "confirmed" && !trips.pickup) {
    return {
      kind: "driver",
      trip: "pickup",
      label: "Assign pick-up driver",
      href: jobPage,
      permission: "jobs:manage",
    };
  }
  if (job.status === "out_for_pickup") {
    return {
      kind: "link",
      label: "Record pick-up",
      href: `${jobPage}/check-in`,
      permission: "jobs:manage",
    };
  }
  // The customer pays online before delivery, or the driver collects cash at the door.
  if ((job.status === "payment_pending" || job.status === "paid") && !trips.drop) {
    return {
      kind: "driver",
      trip: "drop",
      label: "Send for delivery",
      href: jobPage,
      permission: "jobs:deliver",
    };
  }
  if (job.status === "out_for_delivery") {
    return {
      kind: "link",
      label: "Record delivery",
      href: `${jobPage}/handover`,
      permission: "jobs:deliver",
    };
  }
  return undefined;
}

export function getNextAction(
  job: Pick<JobCard, "id" | "status" | "technician" | "pickupDrop">,
): JobAction | undefined {
  const tripAction = getTripAction(job);
  if (tripAction) return tripAction;
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
