import type {
  Customer,
  CustomerDetail,
  CustomerFilters,
  CustomerSummary,
  NewCustomerRequest,
  ServiceVisit,
} from "@/features/customers/types";
import { formatPlate } from "@/features/customers/utils";
import type { JobCard } from "@/features/job-cards/types";
import { approvedLines } from "@/features/job-cards/utils";
import { ApiError } from "@/lib/api-client";
import type { Paginated } from "@/lib/types";
import { business } from "@/mocks/company";
import { customers, otherGarageVisits, vehicles } from "@/mocks/customers";
import { jobCards } from "@/mocks/job-cards";
import { paginate, simulateLatency } from "@/mocks/utils";

const isFinished = (job: JobCard) => job.status === "completed" || job.status === "closed";

/** One of this garage's jobs as a history entry, with its price. */
function toVisit(job: JobCard): ServiceVisit {
  const work = approvedLines(job.estimate?.lines ?? []).map((line) => line.description);
  return {
    id: job.id,
    date: job.handover?.at ?? job.timeline.at(-1)?.at ?? job.createdAt,
    garageName: `${business.name}, ${job.branch.name}`,
    jobId: job.id,
    summary: job.status === "closed" ? "Estimate turned down, no work done" : work.join(", "),
    odometerKm: job.checkIn?.odometerKm,
    totalInPaise: job.invoice?.totalInPaise,
  };
}

/** The list's extra columns for one customer. */
function summarise(customerId: string): Omit<CustomerSummary, keyof Customer> {
  const own = vehicles.filter((vehicle) => vehicle.customerId === customerId);
  const jobs = jobCards.filter((job) => job.customer.id === customerId);
  const lastVisitAt = jobs
    .map((job) => job.createdAt)
    .sort()
    .at(-1);
  return { vehicles: own, jobCount: jobs.length, lastVisitAt };
}

const normalise = (text: string) => text.toUpperCase().replace(/[^A-Z0-9]/g, "");

export async function getCustomersMock({
  q,
  page,
  pageSize,
}: CustomerFilters): Promise<Paginated<CustomerSummary>> {
  await simulateLatency();
  const rows = customers.map((customer) => ({ ...customer, ...summarise(customer.id) }));
  const matching = rows.filter(
    (row) =>
      !q ||
      normalise(`${row.name} ${row.phone} ${row.vehicles.map((v) => v.plate).join(" ")}`).includes(
        normalise(q),
      ),
  );
  matching.sort((a, b) => (b.lastVisitAt ?? "").localeCompare(a.lastVisitAt ?? ""));
  return paginate(matching, page, pageSize);
}

/**
 * The customer with each vehicle's full history: this garage's finished jobs with prices, and
 * other garages' visits (matched by number plate) without them.
 */
export async function getCustomerMock(id: string): Promise<CustomerDetail | null> {
  await simulateLatency();
  const customer = customers.find((candidate) => candidate.id === id);
  if (!customer) return null;
  return {
    ...customer,
    vehicles: vehicles
      .filter((vehicle) => vehicle.customerId === id)
      .map((vehicle) => ({
        ...vehicle,
        visits: [
          ...jobCards
            .filter((job) => job.vehicle.id === vehicle.id && isFinished(job))
            .map(toVisit),
          ...otherGarageVisits
            .filter((visit) => visit.vehicleId === vehicle.id)
            .map(({ vehicleId, ...visit }) => visit),
        ].sort((a, b) => b.date.localeCompare(a.date)),
      })),
  };
}

export async function addCustomerMock(request: NewCustomerRequest): Promise<{ id: string }> {
  await simulateLatency(600);
  if (customers.some((customer) => customer.phone === request.phone)) {
    throw new ApiError(409, { message: "A customer with this mobile is already on file." });
  }
  const plate = request.vehicle && formatPlate(request.vehicle.plate);
  if (plate && vehicles.some((vehicle) => normalise(vehicle.plate) === normalise(plate))) {
    throw new ApiError(409, { message: "This number plate is already on file." });
  }
  const id = `cus-${Date.now()}`;
  const { vehicle, ...details } = request;
  customers.unshift({ ...details, id, hasAppAccount: false, createdAt: new Date().toISOString() });
  if (vehicle && plate)
    vehicles.unshift({ ...vehicle, plate, id: `veh-${Date.now()}`, customerId: id });
  return { id };
}
