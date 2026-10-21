import type {
  EstimateLine,
  EstimateLineKind,
  JobCard,
  JobEvent,
  JobSource,
  JobStatus,
  StaffRef,
} from "@/features/job-cards/types";
import { approvedLines, JOB_FLOW, sumLines } from "@/features/job-cards/utils";
import { customers, vehicles } from "@/mocks/customers";
import { daysFromToday, findById } from "@/mocks/utils";

export const STAFF = {
  mahesh: { id: "usr-mahesh", name: "Mahesh Kumar" },
  ravi: { id: "usr-ravi", name: "Ravi Shankar" },
  shilpa: { id: "usr-shilpa", name: "Shilpa Rao" },
  imran: { id: "usr-imran", name: "Imran Pasha" },
  venkatesh: { id: "usr-venkatesh", name: "Venkatesh Gowda" },
} satisfies Record<string, StaffRef>;

const BRANCHES = {
  whitefield: { id: "br-whitefield", name: "Whitefield" },
  hsr: { id: "br-hsr", name: "HSR Layout" },
};

/** [kind, description, quantity, price in rupees, part number?] */
type LineSeed = [EstimateLineKind, string, number, number, string?];

export type JobSeed = {
  id: string;
  number: string;
  branch: keyof typeof BRANCHES;
  source: JobSource;
  vehicleId: string;
  status: JobStatus;
  /** Days from today the job started (negative = in the past), and the hour. */
  day: number;
  hour?: number;
  complaints: string[];
  lines: LineSeed[];
  technician?: StaffRef;
  odometerKm: number;
  /** Lines the customer turned down, by index. */
  rejected?: number[];
  /** Lines added later as extra work, by index. */
  extra?: number[];
  /** How far the job got along the main path before any side trip; defaults to its status. */
  pathTo?: JobStatus;
  /** Side trips after the main path, e.g. back to approval for extra work, or a QA rework. */
  sideTrip?: JobEvent["status"][];
  paidBy?: "online" | "cash";
  notes?: string[];
};

const manager = (branch: JobSeed["branch"]) => (branch === "hsr" ? STAFF.ravi : STAFF.mahesh);

function estimateLines(seed: JobSeed, isDecided: boolean, isDone: boolean): EstimateLine[] {
  return seed.lines.map(([kind, description, quantity, rupees, partNumber], index) => {
    const isExtra = seed.extra?.includes(index) ?? false;
    const isRejected = seed.rejected?.includes(index) ?? false;
    // Extra work is still waiting for the customer while the job is back with them.
    const isPending = !isDecided || (isExtra && seed.status === "awaiting_approval");
    return {
      id: `${seed.id}-line-${index + 1}`,
      kind,
      description,
      partNumber,
      quantity,
      unitPriceInPaise: rupees * 100,
      gstRatePercent: 18,
      approval: isPending ? "pending" : isRejected ? "rejected" : "approved",
      isExtra,
      isDone: isDone && !isRejected && (kind === "labour" || kind === "service"),
    };
  });
}

/** Builds a complete job card up to its status, so every section has believable data. */
export function jobFromSeed(seed: JobSeed): JobCard {
  const vehicle = findById(vehicles, seed.vehicleId);
  const customer = findById(customers, vehicle.customerId);
  const branch = BRANCHES[seed.branch];
  const furthest = seed.pathTo ?? seed.status;
  const reached = (status: JobStatus) =>
    JOB_FLOW.indexOf(furthest) >= JOB_FLOW.indexOf(status) || seed.status === "closed";
  const isClosed = seed.status === "closed";

  // One event per step reached, 40 minutes apart (a day apart for long-finished jobs).
  const path = JOB_FLOW.filter(
    (status) =>
      (seed.source === "booking" || (status !== "booked" && status !== "confirmed")) &&
      (isClosed
        ? JOB_FLOW.indexOf(status) <= JOB_FLOW.indexOf("awaiting_approval")
        : reached(status)),
  );
  const steps = [...path, ...(seed.sideTrip ?? []), ...(isClosed ? (["closed"] as const) : [])];
  const isOld = seed.day < -3;
  const at = (index: number) =>
    isOld
      ? daysFromToday(seed.day + Math.floor(index / 6), (seed.hour ?? 10) + (index % 6))
      : daysFromToday(seed.day, seed.hour ?? 9, index * 40);
  const timeline: JobEvent[] = steps.map((status, index) => ({ status, at: at(index) }));
  const eventAt = (status: JobStatus) =>
    timeline.find((event) => event.status === status)?.at ?? timeline[0].at;

  const lines = reached("awaiting_approval")
    ? estimateLines(seed, reached("approved") || isClosed, reached("quality_check"))
    : undefined;
  const money = lines ? sumLines(approvedLines(lines)) : undefined;
  const lead = manager(seed.branch);

  return {
    id: seed.id,
    number: seed.number,
    branch,
    source: seed.source,
    customer: { id: customer.id, name: customer.name, phone: customer.phone },
    vehicle: {
      id: vehicle.id,
      plate: vehicle.plate,
      type: vehicle.type,
      make: vehicle.make,
      model: vehicle.model,
    },
    status: seed.status,
    complaints: seed.complaints,
    createdAt: timeline[0].at,
    scheduledAt:
      seed.source === "booking" ? daysFromToday(seed.day, (seed.hour ?? 9) + 2) : undefined,
    promisedAt: reached("approved") ? daysFromToday(seed.day + (isOld ? 1 : 0), 18) : undefined,
    technician: seed.technician,
    checkIn: reached("job_card_created")
      ? {
          at: eventAt("job_card_created"),
          by: lead,
          odometerKm: seed.odometerKm,
          fuelLevel: "half",
          damages: [],
          complaints: seed.complaints,
          photos: [],
        }
      : undefined,
    inspection: reached("inspection")
      ? {
          at: eventAt("inspection"),
          by: seed.technician ?? lead,
          items: [
            {
              id: `${seed.id}-i1`,
              area: "Engine",
              name: "Engine oil level and colour",
              result: "replace",
              photos: [],
            },
            {
              id: `${seed.id}-i2`,
              area: "Brakes",
              name: "Front and rear brakes",
              result: "attention",
              photos: [],
            },
            {
              id: `${seed.id}-i3`,
              area: "Electricals",
              name: "Lights, horn and battery",
              result: "ok",
              photos: [],
            },
            {
              id: `${seed.id}-i4`,
              area: "Tyres",
              name: "Tread and pressure",
              result: "ok",
              photos: [],
            },
          ],
        }
      : undefined,
    estimate: lines && {
      lines,
      sentAt: eventAt("awaiting_approval"),
      approvalNote: reached("approved") || isClosed ? "By phone" : undefined,
      decidedAt: reached("approved")
        ? eventAt("approved")
        : isClosed
          ? eventAt("closed")
          : undefined,
    },
    progress: reached("in_progress")
      ? (seed.notes ?? ["Work started."]).map((text, index) => ({
          id: `${seed.id}-note-${index + 1}`,
          at: eventAt("in_progress"),
          by: seed.technician ?? lead,
          text,
          photos: [],
        }))
      : [],
    qualityChecks: [
      ...(seed.sideTrip?.includes("in_progress")
        ? [
            {
              at: eventAt("quality_check"),
              by: lead,
              result: "rework" as const,
              items: [
                { label: "Brakes bite evenly", isOk: false },
                { label: "No oil leaks", isOk: true },
              ],
              note: "Rear brake still dragging. Adjust and re-check.",
            },
          ]
        : []),
      ...(reached("ready")
        ? [
            {
              at: eventAt("ready"),
              by: lead,
              result: "pass" as const,
              items: [
                { label: "Road test done", isOk: true },
                { label: "Brakes bite evenly", isOk: true },
                { label: "No oil leaks", isOk: true },
                { label: "Washed and cleaned", isOk: true },
              ],
            },
          ]
        : []),
    ],
    invoice:
      money && reached("payment_pending")
        ? {
            number: `SSW/26-27/${seed.number.slice(-4)}`,
            issuedAt: eventAt("payment_pending"),
            ...money,
          }
        : undefined,
    payment:
      money && reached("paid")
        ? {
            method: seed.paidBy ?? "online",
            amountInPaise: money.totalInPaise,
            receivedAt: eventAt("paid"),
            reference:
              seed.paidBy === "cash"
                ? undefined
                : `UPI 6281${seed.number.slice(-4)}${seed.odometerKm}`,
          }
        : undefined,
    handover: reached("completed")
      ? {
          at: eventAt("completed"),
          by: STAFF.shilpa,
          odometerKm: seed.odometerKm + 3,
          checklist: [
            { label: "Vehicle returned to the customer", isDone: true },
            { label: "Old parts shown or handed back", isDone: true },
            { label: "Invoice and report shared", isDone: true },
          ],
        }
      : undefined,
    nextService: reached("completed")
      ? { date: daysFromToday(seed.day + 90), odometerKm: seed.odometerKm + 3000 }
      : undefined,
    timeline,
  };
}
