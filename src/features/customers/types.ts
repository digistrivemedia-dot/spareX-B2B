import type { VehicleType } from "@/features/catalog/types";
import type { ListParams } from "@/lib/types";

/** A vehicle a garage has serviced, known by its number plate. */
export type CustomerVehicle = {
  id: string;
  /** "KA 01 AB 1234", stored with spaces as written on the plate. */
  plate: string;
  type: VehicleType;
  make: string;
  model: string;
  year?: number;
  customerId: string;
};

/** One of the garage's own customers. */
export type Customer = {
  id: string;
  name: string;
  /** E.164, e.g. "+919886044120" */
  phone: string;
  email?: string;
  /** True once the customer has the SpareX app and has added their vehicle's plate. */
  hasAppAccount: boolean;
  createdAt: string;
};

export type CustomerSummary = Customer & {
  vehicles: CustomerVehicle[];
  lastVisitAt?: string;
  jobCount: number;
};

/** A visit in a vehicle's history. Visits to other garages come without prices. */
export type ServiceVisit = {
  id: string;
  date: string;
  garageName: string;
  /** Only for jobs at this garage. */
  jobId?: string;
  summary: string;
  odometerKm?: number;
  /** Absent for other garages' visits. */
  totalInPaise?: number;
};

export type CustomerFilters = ListParams<"name"> & {
  /** Matches name, phone or number plate. */
  q?: string;
};

export type NewCustomerInput = {
  name: string;
  phone: string;
  email?: string;
};

export type NewVehicleInput = Pick<CustomerVehicle, "plate" | "type" | "make" | "model" | "year">;

/** A vehicle with every visit on record, newest first. */
export type VehicleHistory = CustomerVehicle & { visits: ServiceVisit[] };

export type CustomerDetail = Customer & { vehicles: VehicleHistory[] };

export type NewCustomerRequest = NewCustomerInput & { vehicle?: NewVehicleInput };
