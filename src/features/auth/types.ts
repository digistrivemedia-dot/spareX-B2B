import type { Address, Business } from "@/features/company/types";

/**
 * The fixed garage roles. Businesses of other types have a single login with the owner role.
 * owner: garage owner / admin · manager: manager / service advisor · technician: technician /
 * mechanic · spares: spares and inventory executive · billing: billing, QA and delivery executive.
 */
export type Role = "owner" | "manager" | "technician" | "spares" | "billing";

/** "sent_back": Kannali asked for corrections; the business edits and resubmits. */
export type ApprovalStatus = "pending" | "sent_back" | "approved" | "rejected";

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

export type SignInResult =
  | {
      status: "signed_in";
      /** Kept in an httpOnly cookie by the sign-in Server Action; absent for unverified accounts. */
      sessionToken?: string;
      approvalStatus: ApprovalStatus;
      /** True on first login, before the user has chosen their own password. */
      mustSetPassword: boolean;
      /** The registration reference, for accounts not yet approved. */
      applicationRef?: string;
    }
  | TwoFactorChallenge;

/** What the page learns from signing in; the session token itself stays on the server. */
export type SignInOutcome =
  Omit<Extract<SignInResult, { status: "signed_in" }>, "sessionToken"> | TwoFactorChallenge;

export type TwoFactorRequest = {
  challengeId: string;
  code: string;
};

export type TwoFactorResult = { sessionToken: string };

/** A business applying for an account. Kannali staff verify it in the admin panel. */
export type RegistrationApplication = {
  business: Pick<Business, "name" | "type" | "gstin" | "pan"> & {
    licenceNumber?: string;
    /** e.g. a Udyam (MSME) number. */
    otherRegistration?: string;
  };
  /** The contact person, when it isn't the person applying. */
  contact: { name?: string; email: string; phone: string };
  address: Address;
  /** Shop or workshop photos (at least one). */
  photos: string[];
  /** Photos of licences or registration certificates. */
  documents: string[];
};

export type RegistrationReceipt = {
  referenceNumber: string;
  submittedAt: string;
};

/** Where an application stands, as the applicant sees it. */
export type ApplicationStatus = RegistrationReceipt & {
  status: ApprovalStatus;
  application: RegistrationApplication;
  reviewedAt?: string;
  /** What Kannali needs changed, when it is sent back. */
  reviewNotes?: string[];
  /** Why it was turned down, when rejected. */
  rejectionReason?: string;
};

export type SetPasswordRequest = {
  password: string;
  /** From the reset link; first-login password changes don't need one. */
  resetToken?: string;
};
