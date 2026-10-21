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
