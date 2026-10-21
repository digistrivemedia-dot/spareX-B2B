import type { BookedService, Booking, BookingFilters } from "@/features/bookings/types";
import type { JobCard } from "@/features/job-cards/types";
import { ApiError } from "@/lib/api-client";
import { toIndiaDate } from "@/lib/dates";
import type { Paginated } from "@/lib/types";
import { currentStaffMock } from "@/mocks/auth";
import { customers, vehicles } from "@/mocks/customers";
import { getGarageProfileMock } from "@/mocks/garage";
import { jobCards, nextJobNumber } from "@/mocks/job-cards";
import { daysFromToday, findById, paginate, simulateLatency, sortItems } from "@/mocks/utils";

const WHITEFIELD = { id: "br-whitefield", name: "Whitefield" };
const HSR = { id: "br-hsr", name: "HSR Layout" };

const service = (serviceId: string, name: string, rupees: number): BookedService => ({
  serviceId,
  name,
  priceInPaise: rupees * 100,
});

const GENERAL = service("svc-general", "General service (up to 150 cc)", 899);
const GENERAL_PLUS = service("svc-general-plus", "General service (150–400 cc)", 1499);
const WASH = service("svc-wash", "Foam wash and polish", 249);

/** A booking that was accepted takes its customer and vehicle from the job card it became. */
function acceptedFrom(
  jobId: string,
  id: string,
  number: string,
  services: BookedService[],
): Booking {
  const job = findById(jobCards, jobId);
  return {
    id,
    number,
    status: "accepted",
    branch: job.branch,
    createdAt: daysFromToday(-1, 19, 10),
    slotAt: job.scheduledAt ?? job.createdAt,
    customer: { name: job.customer.name, phone: job.customer.phone, customerId: job.customer.id },
    vehicle: { ...job.vehicle, vehicleId: job.vehicle.id },
    services,
    jobId,
  };
}

export const bookings: Booking[] = [
  {
    id: "bk-0233",
    number: "BK-2610-0233",
    status: "new",
    branch: WHITEFIELD,
    createdAt: daysFromToday(0, 7, 45),
    slotAt: daysFromToday(0, 16),
    customer: { name: "Sneha Pillai", phone: "+919880945563", customerId: "cus-sneha" },
    vehicle: {
      plate: "KA 53 HE 1478",
      type: "two_wheeler",
      make: "Honda",
      model: "Activa 6G",
      vehicleId: "veh-sneha-activa",
    },
    services: [WASH],
    notes: "Picking up the scooter after work, around 6.",
  },
  {
    id: "bk-0232",
    number: "BK-2610-0232",
    status: "new",
    branch: WHITEFIELD,
    createdAt: daysFromToday(-1, 21, 5),
    slotAt: daysFromToday(1, 10),
    customer: { name: "Harish Murthy", phone: "+919845603318" },
    vehicle: {
      plate: "KA 01 ML 4402",
      type: "two_wheeler",
      make: "Royal Enfield",
      model: "Classic 350",
    },
    services: [GENERAL_PLUS],
    notes: "Clutch feels hard. Please check.",
  },
  {
    id: "bk-0231",
    number: "BK-2610-0231",
    status: "new",
    branch: HSR,
    createdAt: daysFromToday(-1, 18, 30),
    slotAt: daysFromToday(1, 11, 30),
    customer: { name: "Nisha Rao", phone: "+919591166740" },
    vehicle: { plate: "KA 51 JK 9015", type: "two_wheeler", make: "TVS", model: "Jupiter" },
    services: [GENERAL, WASH],
  },
  acceptedFrom("job-0151", "bk-0229", "BK-2610-0229", [GENERAL]),
  acceptedFrom("job-0149", "bk-0227", "BK-2610-0227", [GENERAL]),
  acceptedFrom("job-0146", "bk-0226", "BK-2610-0226", [GENERAL]),
  {
    id: "bk-0224",
    number: "BK-2610-0224",
    status: "declined",
    branch: HSR,
    createdAt: daysFromToday(-2, 9, 20),
    slotAt: daysFromToday(-1, 10),
    customer: { name: "Karthik Bhat", phone: "+919742210986" },
    vehicle: { plate: "KA 03 NC 7330", type: "two_wheeler", make: "KTM", model: "Duke 390" },
    services: [GENERAL_PLUS],
    notes: "Also need the engine opened up, it knocks.",
    declineReason:
      "Fully booked that day, and engine rebuilds on 390s need the KTM service centre.",
  },
];

export async function getBookingsMock({
  status,
  branchId,
  date,
  sort = "slotAt",
  order = "asc",
  page,
  pageSize,
}: BookingFilters): Promise<Paginated<Booking>> {
  await simulateLatency();
  const matching = bookings.filter(
    (booking) =>
      (!status || booking.status === status) &&
      (!branchId || booking.branch.id === branchId) &&
      (!date || toIndiaDate(booking.slotAt) === date),
  );
  return paginate(sortItems(matching, sort, order), page, pageSize);
}

export async function getBookingMock(id: string): Promise<Booking | null> {
  await simulateLatency();
  return bookings.find((booking) => booking.id === id) ?? null;
}

function requireNewBooking(id: string): Booking {
  const booking = bookings.find((candidate) => candidate.id === id);
  if (!booking) throw new ApiError(404, { message: "We couldn't find that booking." });
  if (booking.status !== "new") {
    throw new ApiError(409, { message: "This booking has already been answered." });
  }
  return booking;
}

/** The customer and vehicle on file for a booking, added now if they are new to the garage. */
function findOrAddVehicle(booking: Booking) {
  const known = vehicles.find((vehicle) => vehicle.plate === booking.vehicle.plate);
  if (known) return known;
  const now = new Date().toISOString();
  const customer = customers.find((c) => c.phone === booking.customer.phone) ?? {
    id: `cus-${Date.now()}`,
    name: booking.customer.name,
    phone: booking.customer.phone,
    hasAppAccount: true,
    createdAt: now,
  };
  if (!customers.includes(customer)) customers.unshift(customer);
  const vehicle = { id: `veh-${Date.now()}`, customerId: customer.id, ...booking.vehicle };
  vehicles.unshift(vehicle);
  return vehicle;
}

/** Accepting confirms the slot and opens a job card waiting for the vehicle. */
export async function acceptBookingMock(id: string): Promise<JobCard> {
  await simulateLatency(700);
  const by = currentStaffMock();
  const booking = requireNewBooking(id);
  const { dailyBookingLimit } = await getGarageProfileMock();
  const sameDay = bookings.filter(
    (other) =>
      other.status === "accepted" &&
      other.branch.id === booking.branch.id &&
      toIndiaDate(other.slotAt) === toIndiaDate(booking.slotAt),
  );
  if (sameDay.length >= dailyBookingLimit) {
    throw new ApiError(409, {
      message: "This branch is fully booked that day. Decline or move it.",
    });
  }
  const vehicle = findOrAddVehicle(booking);
  const customer = findById(customers, vehicle.customerId);
  const now = new Date().toISOString();
  const number = nextJobNumber();
  const job: JobCard = {
    id: `job-${number.slice(-4)}`,
    number,
    branch: booking.branch,
    source: "booking",
    bookingId: booking.id,
    customer: { id: customer.id, name: customer.name, phone: customer.phone },
    vehicle: {
      id: vehicle.id,
      plate: vehicle.plate,
      type: vehicle.type,
      make: vehicle.make,
      model: vehicle.model,
    },
    status: "confirmed",
    complaints: [...booking.services.map((s) => s.name), ...(booking.notes ? [booking.notes] : [])],
    createdAt: now,
    scheduledAt: booking.slotAt,
    progress: [],
    qualityChecks: [],
    timeline: [
      { status: "booked", at: booking.createdAt },
      { status: "confirmed", at: now, note: `Accepted by ${by.name}` },
    ],
  };
  jobCards.unshift(job);
  Object.assign(booking, { status: "accepted", jobId: job.id });
  return job;
}

export async function declineBookingMock(id: string, reason: string): Promise<Booking> {
  await simulateLatency(600);
  return Object.assign(requireNewBooking(id), { status: "declined", declineReason: reason });
}
