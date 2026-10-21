import type { BranchRef } from "@/features/company/types";
import type { CustomerVehicle } from "@/features/customers/types";
import type { ListParams } from "@/lib/types";

/**
 * Booked → Confirmed → Vehicle received → Job card created → Inspection → Waiting for customer
 * approval → Approved → Service in progress → Quality check → Ready for delivery → Payment
 * pending → Paid → Completed. "closed" is a job whose estimate was rejected in full (no fee).
 */
export type JobStatus =
  | "booked"
  | "confirmed"
  | "vehicle_received"
  | "job_card_created"
  | "inspection"
  | "awaiting_approval"
  | "approved"
  | "in_progress"
  | "quality_check"
  | "ready"
  | "payment_pending"
  | "paid"
  | "completed"
  | "closed";

export type StaffRef = { id: string; name: string };

export type FuelLevel = "empty" | "quarter" | "half" | "three_quarters" | "full";

export type DamageNote = {
  id: string;
  /** Where on the vehicle, e.g. "Left side panel". */
  area: string;
  note: string;
  photos: string[];
};

/** What the vehicle came in with, recorded when it is received. */
export type CheckIn = {
  at: string;
  by: StaffRef;
  odometerKm: number;
  fuelLevel: FuelLevel;
  damages: DamageNote[];
  complaints: string[];
  photos: string[];
};

export type InspectionResult = "ok" | "attention" | "replace";

export type InspectionItem = {
  id: string;
  /** e.g. "Brakes". */
  area: string;
  name: string;
  result: InspectionResult;
  note?: string;
  photos: string[];
};

export type Inspection = {
  at: string;
  by: StaffRef;
  items: InspectionItem[];
};

export type EstimateLineKind = "labour" | "service" | "part" | "consumable";

export type LineApproval = "pending" | "approved" | "rejected";

export type EstimateLine = {
  id: string;
  kind: EstimateLineKind;
  description: string;
  /** Parts from the SpareX catalogue keep their part number. */
  partNumber?: string;
  quantity: number;
  /** The garage's price per unit, excluding GST. */
  unitPriceInPaise: number;
  gstRatePercent: number;
  approval: LineApproval;
  /** Added after the first approval, as extra work. */
  isExtra: boolean;
  /** Work lines the technician has finished. */
  isDone?: boolean;
};

export type Estimate = {
  lines: EstimateLine[];
  /** When the latest version went to the customer. */
  sentAt?: string;
  /** How the customer gave their decision, e.g. "By phone". */
  approvalNote?: string;
  decidedAt?: string;
};

export type ProgressNote = {
  id: string;
  at: string;
  by: StaffRef;
  text: string;
  photos: string[];
  /** The technician found more work that needs the customer's approval. */
  isExtraWork?: boolean;
};

export type QualityCheck = {
  at: string;
  by: StaffRef;
  result: "pass" | "rework";
  items: { label: string; isOk: boolean }[];
  note?: string;
};

/** The garage's own tax invoice to its customer, in the garage's name and GSTIN. */
export type GarageInvoice = {
  number: string;
  issuedAt: string;
  subtotalInPaise: number;
  gstInPaise: number;
  totalInPaise: number;
};

export type GaragePayment = {
  method: "online" | "cash";
  amountInPaise: number;
  receivedAt: string;
  receivedBy?: StaffRef;
  /** UPI or payment-link reference for online payments. */
  reference?: string;
  /** Cash handed over, when it was more than the bill. */
  cashReceivedInPaise?: number;
};

export type Handover = {
  at: string;
  by: StaffRef;
  odometerKm: number;
  checklist: { label: string; isDone: boolean }[];
  /** The vehicle as it left. */
  photos?: string[];
};

export type JobEvent = {
  status: JobStatus;
  at: string;
  note?: string;
};

export type JobSource = "booking" | "walk_in";

export type JobCard = {
  id: string;
  number: string;
  branch: BranchRef;
  source: JobSource;
  bookingId?: string;
  customer: { id: string; name: string; phone: string };
  vehicle: Pick<CustomerVehicle, "id" | "plate" | "type" | "make" | "model">;
  status: JobStatus;
  /** What the customer said is wrong, in their words. */
  complaints: string[];
  createdAt: string;
  /** For bookings: when the vehicle is due in. */
  scheduledAt?: string;
  /** When the garage promised the vehicle back. */
  promisedAt?: string;
  technician?: StaffRef;
  checkIn?: CheckIn;
  inspection?: Inspection;
  estimate?: Estimate;
  progress: ProgressNote[];
  qualityChecks: QualityCheck[];
  invoice?: GarageInvoice;
  payment?: GaragePayment;
  handover?: Handover;
  /** Next service due, set at completion. */
  nextService?: { date?: string; odometerKm?: number };
  timeline: JobEvent[];
};

/** What the job card list returns per row. */
export type JobCardSummary = Pick<
  JobCard,
  | "id"
  | "number"
  | "branch"
  | "source"
  | "customer"
  | "vehicle"
  | "status"
  | "createdAt"
  | "scheduledAt"
  | "promisedAt"
  | "technician"
> & {
  /** The estimate or invoice total, including GST, once there is one. */
  amountInPaise?: number;
};

export type JobCardFilters = ListParams<"createdAt"> & {
  statuses?: JobStatus[];
  branchId?: string;
  technicianId?: string;
  /** Matches the job number, number plate or customer name. */
  q?: string;
};

export type WalkInRequest = {
  branchId: string;
  /** An existing vehicle, or the details of a new one with its customer. */
  vehicleId?: string;
  newVehicle?: {
    plate: string;
    type: CustomerVehicle["type"];
    make: string;
    model: string;
    customer: { name: string; phone: string };
  };
  complaints: string[];
};

export type CheckInRequest = Omit<CheckIn, "at" | "by">;

export type InspectionRequest = { items: InspectionItem[] };

/** A line as the estimate builder sends it; the customer's approval is recorded separately. */
export type EstimateLineInput = Omit<EstimateLine, "approval" | "isExtra" | "isDone">;

export type EstimateRequest = { lines: EstimateLineInput[] };

export type ApprovalRequest = {
  /** The customer's answer for each line waiting on them. */
  decisions: Record<string, "approved" | "rejected">;
  /** How they answered, e.g. "By phone". */
  note: string;
};

export type ProgressRequest = {
  text: string;
  photos: string[];
  /** True when the technician found more work that needs the customer's approval. */
  isExtraWork: boolean;
};

export type QualityCheckRequest = Omit<QualityCheck, "at" | "by">;

export type CollectPaymentRequest =
  { method: "online"; reference: string } | { method: "cash"; cashReceivedInPaise: number };

export type HandoverRequest = Omit<Handover, "at" | "by"> & {
  nextService?: JobCard["nextService"];
  /** The vehicle as it leaves, for the completion report. */
  photos: string[];
};
