import type { Business } from "@/features/company/types";

export type Role =
  "owner" | "manager" | "service_advisor" | "technician" | "inventory_manager" | "accountant";

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
  role: Role;
  approvalStatus: ApprovalStatus;
};
