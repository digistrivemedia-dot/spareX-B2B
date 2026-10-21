import type { Role } from "@/features/auth/types";
import type { ListParams } from "@/lib/types";

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
  /** Optional at registration; businesses without GST can still buy. */
  gstin?: string;
  pan?: string;
  email: string;
  /** E.164, e.g. "+919886044120" */
  phone: string;
  registeredAddress: Address;
  approvedAt: string;
  /** Set by Kannali: the business price is the B2C price less this percentage. */
  discountPercent: number;
  /** Kannali enables credit per business; credit screens and payment appear only when true. */
  creditEnabled: boolean;
  /** Shop photos sent with the registration. */
  photos: string[];
  /** Licence and certificate photos sent with the registration. */
  documents: string[];
};

/** What the business can change itself; name, type, GSTIN and PAN are fixed once verified. */
export type BusinessContactUpdate = Pick<Business, "email" | "phone">;

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

/** What is sent to add or change a branch (delivery address). */
export type BranchInput = Pick<Branch, "name" | "address" | "contactName" | "contactPhone">;

export type CompanyUserStatus = "active" | "invited" | "disabled";

export type CompanyUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** One person can hold several roles. */
  roles: Role[];
  /** Staff work at one branch and see only its jobs. */
  branchId: string;
  status: CompanyUserStatus;
  lastActiveAt?: string;
};

export type CompanyUserInput = Pick<CompanyUser, "name" | "email" | "phone" | "roles" | "branchId">;

export type CompanyUserFilters = ListParams<"name"> & {
  role?: Role;
  branchId?: string;
};

/** What a PIN code lookup returns, used to fill in city and state. */
export type PincodeDetails = {
  pin: string;
  city: string;
  state: string;
};
