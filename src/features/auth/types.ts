import type { Address, Business } from "@/features/company/types";

/**
 * The fixed garage roles. Businesses of other types have a single login with the owner role.
 * owner: garage owner / admin · manager: manager / service advisor · technician: technician /
 * mechanic · spares: spares and inventory executive · billing: billing, QA and delivery executive.
 */
export type Role = "owner" | "manager" | "technician" | "spares" | "billing";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type User = {
  id: string;
  name: string;
  email: string;
  /** E.164, e.g. "+919886044120" */
  phone: string;
};

export type Session = {
  user: User;
  business: Business;
  roles: Role[];
  /** The branch the user works at. Owners can switch branch from the top bar. */
  branchId: string;
  approvalStatus: ApprovalStatus;
};

export type SignInRequest = {
  email: string;
  password: string;
};

/** Returned instead of signing in when the account has 2-step verification switched on. */
export type TwoFactorChallenge = {
  status: "two_factor_required";
  challengeId: string;
  /** e.g. "+91 98860 ••120", to show where the code went. */
  maskedPhone: string;
};

export type SignInResult = { status: "signed_in" } | TwoFactorChallenge;

export type TwoFactorRequest = {
  challengeId: string;
  code: string;
};

/** A business applying for an account. Kannali staff approve it in the admin panel. */
export type RegistrationApplication = {
  business: Pick<Business, "name" | "type" | "gstin" | "pan">;
  contact: { name: string; email: string; phone: string };
  address: Address;
};

export type RegistrationReceipt = {
  referenceNumber: string;
  submittedAt: string;
};
