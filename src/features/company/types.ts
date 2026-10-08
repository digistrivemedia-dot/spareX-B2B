import type { Role } from "@/features/auth/types";
import type { BikeModel } from "@/features/catalog/types";

export type BusinessType = "garage" | "fleet" | "dealer" | "retailer" | "reseller" | "corporate";

export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pin: string;
};

export type Business = {
  id: string;
  name: string;
  type: BusinessType;
  gstin: string;
  pan: string;
  email: string;
  /** E.164, e.g. "+919886044120" */
  phone: string;
  registeredAddress: Address;
  approvedAt: string;
};

export type Branch = {
  id: string;
  name: string;
  isMain: boolean;
  address: Address;
  contactName: string;
  contactPhone: string;
};

/** The minimal branch reference embedded in orders and quotations. */
export type BranchRef = Pick<Branch, "id" | "name">;

export type CompanyUserStatus = "active" | "invited" | "disabled";

export type CompanyUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: CompanyUserStatus;
  lastActiveAt?: string;
};

export type FleetVehicle = {
  id: string;
  registrationNumber: string;
  bike: BikeModel;
  year: number;
  branchId: string;
  odometerKm: number;
};

/** What a PIN code lookup returns, used to fill in city and state. */
export type PincodeDetails = {
  pin: string;
  city: string;
  state: string;
};
