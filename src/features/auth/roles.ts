import type { Role } from "@/features/auth/types";

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner / admin",
  manager: "Manager / service advisor",
  technician: "Technician / mechanic",
  spares: "Spares & inventory executive",
  billing: "Billing, QA & delivery executive",
};

/** "Owner / admin", or "Manager / service advisor + 1 more" for someone with several roles. */
export function describeRoles(roles: readonly Role[]): string {
  const [first, ...rest] = roles;
  const label = ROLE_LABELS[first];
  return rest.length ? `${label} + ${rest.length} more` : label;
}

/** What each role works on, shown when choosing roles for a user. */
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: "Everything in the garage, plus users, branches, buying and payments",
  manager: "Bookings, walk-ins, check-in, job cards, estimates, technicians, QA and delivery",
  technician: "Their own jobs: inspection, progress updates and parts used",
  spares: "Parts for each job and ordering from SpareX",
  billing: "Quality check, billing, collecting payment and handing vehicles back",
};

export const ROLES = Object.keys(ROLE_LABELS) as Role[];
