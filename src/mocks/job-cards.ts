import type {
  CheckInRequest,
  JobCard,
  JobCardFilters,
  JobCardSummary,
  JobStatus,
  WalkInRequest,
} from "@/features/job-cards/types";
import { sumLines } from "@/features/job-cards/utils";
import { ApiError } from "@/lib/api-client";
import type { Paginated } from "@/lib/types";
import { currentStaffMock } from "@/mocks/auth";
import { branches } from "@/mocks/company";
import { customers, vehicles } from "@/mocks/customers";
import { jobFromSeed, STAFF, type JobSeed } from "@/mocks/job-card-seeds";
import { findById, paginate, simulateLatency, sortItems } from "@/mocks/utils";

const GENERAL_SERVICE: JobSeed["lines"] = [
  ["service", "General service (up to 150 cc)", 1, 899],
  ["part", "Castrol Activ 4T 20W-40, 1 L", 1, 345, "CAS-3421188"],
  ["part", "Bosch spark plug UR5DC", 1, 110, "BSH-UR5DC"],
];

const seeds: JobSeed[] = [
  {
    id: "job-0151",
    number: "JC-2610-0151",
    branch: "whitefield",
    source: "booking",
    vehicleId: "veh-kavya-access",
    status: "confirmed",
    day: 0,
    hour: 9,
    odometerKm: 3820,
    complaints: ["First paid service", "Front brake squeaks"],
    lines: GENERAL_SERVICE,
  },
  {
    id: "job-0150",
    number: "JC-2610-0150",
    branch: "whitefield",
    source: "walk_in",
    vehicleId: "veh-vinod-fz",
    status: "vehicle_received",
    day: 0,
    hour: 10,
    odometerKm: 41260,
    complaints: ["Engine stalls at signals", "Chain noisy"],
    lines: [],
  },
  {
    id: "job-0149",
    number: "JC-2610-0149",
    branch: "hsr",
    source: "booking",
    vehicleId: "veh-ananya-dio",
    status: "job_card_created",
    day: 0,
    hour: 8,
    odometerKm: 6140,
    complaints: ["General service", "Self start weak in the mornings"],
    lines: GENERAL_SERVICE,
  },
  {
    id: "job-0148",
    number: "JC-2610-0148",
    branch: "whitefield",
    source: "booking",
    vehicleId: "veh-rahul-duke",
    status: "inspection",
    day: 0,
    hour: 8,
    odometerKm: 14980,
    technician: STAFF.imran,
    complaints: ["Gear shifts hard", "Service due"],
    lines: [],
  },
  {
    id: "job-0147",
    number: "JC-2610-0147",
    branch: "hsr",
    source: "walk_in",
    vehicleId: "veh-faisal-classic",
    status: "awaiting_approval",
    day: -1,
    hour: 15,
    odometerKm: 8730,
    technician: STAFF.venkatesh,
    complaints: ["Rear brake weak", "Oil change"],
    lines: [
      ["service", "General service (150–400 cc)", 1, 1499],
      ["part", "Royal Enfield rear brake shoe set", 1, 520, "RE-888359"],
      ["part", "Royal Enfield oil filter", 1, 105, "RE-888441"],
      ["consumable", "Shell Advance Ultra 15W-50, 2.5 L", 1, 1190],
      ["labour", "Brake drum cleaning", 1, 150],
    ],
  },
  {
    id: "job-0146",
    number: "JC-2610-0146",
    branch: "whitefield",
    source: "booking",
    vehicleId: "veh-arjun-activa",
    status: "approved",
    day: 0,
    hour: 8,
    odometerKm: 18320,
    complaints: ["Due for service"],
    lines: GENERAL_SERVICE,
  },
  {
    id: "job-0145",
    number: "JC-2610-0145",
    branch: "whitefield",
    source: "walk_in",
    vehicleId: "veh-suresh-pulsar",
    status: "in_progress",
    day: -1,
    hour: 11,
    odometerKm: 52640,
    technician: STAFF.imran,
    complaints: ["Clutch slipping", "Chain loose"],
    notes: ["Clutch plates worn to the limit. Replacing as approved.", "Chain adjusted."],
    lines: [
      ["labour", "Clutch overhaul", 1, 650],
      ["part", "Bajaj clutch plate set, Pulsar 150", 1, 1180, "BJ-JL531008"],
      ["service", "Chain clean, lube and adjust", 1, 199],
    ],
  },
  {
    id: "job-0144",
    number: "JC-2610-0144",
    branch: "hsr",
    source: "booking",
    vehicleId: "veh-deepak-himalayan",
    status: "awaiting_approval",
    pathTo: "in_progress",
    sideTrip: ["awaiting_approval"],
    extra: [2, 3],
    day: -1,
    hour: 9,
    odometerKm: 27410,
    technician: STAFF.venkatesh,
    complaints: ["Service", "Vibration at 70 km/h"],
    notes: ["Found the front wheel bearing worn while servicing. Customer asked to approve."],
    lines: [
      ["service", "General service (150–400 cc)", 1, 1499],
      ["consumable", "Motul 3100 Gold 10W-30, 2.5 L", 1, 1250],
      ["part", "Front wheel bearing set", 1, 640],
      ["labour", "Wheel bearing replacement", 1, 350],
    ],
  },
  {
    id: "job-0143",
    number: "JC-2610-0143",
    branch: "whitefield",
    source: "booking",
    vehicleId: "veh-lakshmi-jupiter",
    status: "quality_check",
    day: -1,
    hour: 10,
    odometerKm: 22105,
    technician: STAFF.imran,
    complaints: ["General service", "Headlight dim"],
    lines: [...GENERAL_SERVICE, ["part", "Philips HS1 headlight bulb", 1, 175, "PHL-12636C1"]],
  },
  {
    id: "job-0142",
    number: "JC-2610-0142",
    branch: "hsr",
    source: "walk_in",
    vehicleId: "veh-irfan-apache",
    status: "in_progress",
    sideTrip: ["quality_check", "in_progress"],
    day: -1,
    hour: 12,
    odometerKm: 33870,
    technician: STAFF.venkatesh,
    complaints: ["Brakes noisy"],
    notes: ["Rear caliper cleaned and pads replaced."],
    lines: [
      ["labour", "Brake service, front and rear", 1, 399],
      ["part", "TVS rear brake pads, Apache RTR 160", 1, 420],
    ],
  },
  {
    id: "job-0141",
    number: "JC-2610-0141",
    branch: "whitefield",
    source: "booking",
    vehicleId: "veh-priya-ntorq",
    status: "ready",
    day: -1,
    hour: 9,
    odometerKm: 11420,
    technician: STAFF.imran,
    complaints: ["Service and wash"],
    lines: [...GENERAL_SERVICE, ["service", "Foam wash and polish", 1, 249]],
  },
  {
    id: "job-0140",
    number: "JC-2610-0140",
    branch: "whitefield",
    source: "walk_in",
    vehicleId: "veh-sneha-activa",
    status: "payment_pending",
    day: -1,
    hour: 10,
    odometerKm: 29880,
    technician: STAFF.imran,
    complaints: ["Battery dead", "Service"],
    lines: [
      ...GENERAL_SERVICE,
      ["part", "Amaron Pro Bike Rider ETZ5L battery", 1, 1950, "AMR-ETZ5L"],
    ],
  },
  {
    id: "job-0139",
    number: "JC-2610-0139",
    branch: "hsr",
    source: "walk_in",
    vehicleId: "veh-suresh-splendor",
    status: "paid",
    paidBy: "cash",
    day: -1,
    hour: 11,
    odometerKm: 61200,
    technician: STAFF.venkatesh,
    complaints: ["Oil change", "Horn not working"],
    lines: [
      ["service", "Engine oil change", 1, 249],
      ["part", "Castrol Activ 4T 20W-40, 1 L", 1, 345, "CAS-3421188"],
      ["part", "Uno Minda HN-35 horn", 1, 290, "MND-HN35"],
    ],
  },
  {
    id: "job-0088",
    number: "JC-2607-0088",
    branch: "whitefield",
    source: "booking",
    vehicleId: "veh-arjun-activa",
    status: "completed",
    day: -95,
    odometerKm: 15240,
    technician: STAFF.imran,
    complaints: ["Service due"],
    lines: GENERAL_SERVICE,
  },
  {
    id: "job-0137",
    number: "JC-2610-0137",
    branch: "hsr",
    source: "walk_in",
    vehicleId: "veh-vinod-fz",
    status: "closed",
    rejected: [0, 1],
    day: -2,
    hour: 16,
    odometerKm: 41190,
    technician: STAFF.venkatesh,
    complaints: ["Front fork leaking"],
    lines: [
      ["part", "Front fork oil seal kit", 1, 780],
      ["labour", "Fork overhaul", 1, 900],
    ],
  },
  {
    id: "job-0121",
    number: "JC-2609-0121",
    branch: "whitefield",
    source: "walk_in",
    vehicleId: "veh-rahul-duke",
    status: "completed",
    day: -40,
    odometerKm: 12100,
    technician: STAFF.imran,
    complaints: ["Chain kit worn"],
    lines: [
      ["part", "Rolon O-ring chain sprocket kit, Duke/RC 200", 1, 2690, "RLN-CK-2412"],
      ["labour", "Chain sprocket kit fitting", 1, 599],
    ],
  },
  {
    id: "job-0108",
    number: "JC-2608-0108",
    branch: "hsr",
    source: "booking",
    vehicleId: "veh-faisal-classic",
    status: "completed",
    day: -62,
    odometerKm: 6010,
    technician: STAFF.venkatesh,
    complaints: ["First paid service"],
    lines: [["service", "General service (150–400 cc)", 1, 1499]],
  },
  {
    id: "job-0096",
    number: "JC-2607-0096",
    branch: "whitefield",
    source: "walk_in",
    vehicleId: "veh-sneha-activa",
    status: "completed",
    day: -120,
    odometerKm: 26900,
    technician: STAFF.imran,
    complaints: ["Service"],
    lines: GENERAL_SERVICE,
  },
];

export const jobCards: JobCard[] = seeds.map(jobFromSeed);

/** The bill so far: the invoice once raised, otherwise the approved (or quoted) estimate. */
function amountOf(job: JobCard): number | undefined {
  if (job.invoice) return job.invoice.totalInPaise;
  if (!job.estimate) return undefined;
  return sumLines(job.estimate.lines.filter((line) => line.approval !== "rejected")).totalInPaise;
}

export function toJobSummary(job: JobCard): JobCardSummary {
  const { id, number, branch, source, customer, vehicle, status, createdAt } = job;
  const { scheduledAt, promisedAt, technician } = job;
  return {
    id,
    number,
    branch,
    source,
    customer,
    vehicle,
    status,
    createdAt,
    scheduledAt,
    promisedAt,
    technician,
    amountInPaise: amountOf(job),
  };
}

const normalise = (text: string) => text.toUpperCase().replace(/[^A-Z0-9]/g, "");

export function filterJobs({ statuses, branchId, technicianId, q }: JobCardFilters): JobCard[] {
  return jobCards.filter(
    (job) =>
      (!statuses?.length || statuses.includes(job.status)) &&
      (!branchId || job.branch.id === branchId) &&
      (!technicianId || job.technician?.id === technicianId) &&
      (!q ||
        normalise(`${job.number} ${job.vehicle.plate} ${job.customer.name}`).includes(
          normalise(q),
        )),
  );
}

export async function getJobCardsMock(filters: JobCardFilters): Promise<Paginated<JobCardSummary>> {
  await simulateLatency();
  const { sort = "createdAt", order = "desc", page, pageSize } = filters;
  return paginate(sortItems(filterJobs(filters), sort, order).map(toJobSummary), page, pageSize);
}

export async function getJobCardMock(id: string): Promise<JobCard | null> {
  await simulateLatency();
  return jobCards.find((job) => job.id === id) ?? null;
}

export function requireJob(id: string): JobCard {
  const job = jobCards.find((candidate) => candidate.id === id);
  if (!job) throw new ApiError(404, { message: "We couldn't find that job card." });
  return job;
}

/** Moves a job to its next status, refusing if it has moved on since the page was loaded. */
export function advanceJob(job: JobCard, from: JobStatus[], to: JobStatus, note?: string) {
  if (!from.includes(job.status)) {
    throw new ApiError(409, { message: "This job has changed. Refresh the page to see it." });
  }
  job.status = to;
  job.timeline.push({ status: to, at: new Date().toISOString(), note });
}

/** The next job number, e.g. "JC-2610-0152" (year and month, then a running number). */
export function nextJobNumber(): string {
  const latest = Math.max(...jobCards.map((job) => Number(job.number.slice(-4))));
  const now = new Date();
  const yymm = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
  return `JC-${yymm}-${String(latest + 1).padStart(4, "0")}`;
}

/** A walk-in starts at "Vehicle received"; a new plate creates the customer and vehicle too. */
export async function createWalkInMock(request: WalkInRequest): Promise<JobCard> {
  await simulateLatency(800);
  const by = currentStaffMock();
  const vehicle = request.vehicleId
    ? findById(vehicles, request.vehicleId)
    : addVehicleWithCustomer(request.newVehicle);
  const customer = findById(customers, vehicle.customerId);
  const { id: branchId, name } = findById(branches, request.branchId);
  const now = new Date().toISOString();
  const number = nextJobNumber();
  const job: JobCard = {
    id: `job-${number.slice(-4)}`,
    number,
    branch: { id: branchId, name },
    source: "walk_in",
    customer: { id: customer.id, name: customer.name, phone: customer.phone },
    vehicle: {
      id: vehicle.id,
      plate: vehicle.plate,
      type: vehicle.type,
      make: vehicle.make,
      model: vehicle.model,
    },
    status: "vehicle_received",
    complaints: request.complaints,
    createdAt: now,
    progress: [],
    qualityChecks: [],
    timeline: [{ status: "vehicle_received", at: now, note: `Walk-in, received by ${by.name}` }],
  };
  jobCards.unshift(job);
  return job;
}

function addVehicleWithCustomer(details: WalkInRequest["newVehicle"]) {
  if (!details) throw new ApiError(422, { message: "Choose a vehicle or add a new one." });
  const plate = normalise(details.plate);
  if (vehicles.some((vehicle) => normalise(vehicle.plate) === plate)) {
    throw new ApiError(409, {
      message: "This number plate is already on file. Search for it instead.",
    });
  }
  const now = new Date().toISOString();
  const customer = customers.find((c) => c.phone === details.customer.phone) ?? {
    id: `cus-${Date.now()}`,
    name: details.customer.name,
    phone: details.customer.phone,
    hasAppAccount: false,
    createdAt: now,
  };
  if (!customers.includes(customer)) customers.unshift(customer);
  const vehicle = {
    id: `veh-${Date.now()}`,
    customerId: customer.id,
    plate: details.plate,
    type: details.type,
    make: details.make,
    model: details.model,
  };
  vehicles.unshift(vehicle);
  return vehicle;
}

/** Recording the vehicle's condition turns a received vehicle into an open job card. */
export async function checkInMock(id: string, request: CheckInRequest): Promise<JobCard> {
  await simulateLatency(800);
  const by = currentStaffMock();
  const job = requireJob(id);
  const now = new Date().toISOString();
  if (job.status === "confirmed") advanceJob(job, ["confirmed"], "vehicle_received");
  advanceJob(job, ["vehicle_received"], "job_card_created");
  job.checkIn = { ...request, at: now, by };
  job.complaints = request.complaints;
  return job;
}
