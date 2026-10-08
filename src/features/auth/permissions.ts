import type { Role } from "@/features/auth/types";

const ALL_PERMISSIONS = [
  "catalog:view",
  "orders:view",
  "orders:place",
  "quotations:view",
  "quotations:respond",
  "credit:view",
  "credit:pay",
  "company:view",
  "company:manage",
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

// Every role gets everything until the client signs off the access matrix (Garage OS, phase 2).
// Narrowing a role later means editing only its list here.
const PERMISSIONS_BY_ROLE: Record<Role, readonly Permission[]> = {
  owner: ALL_PERMISSIONS,
  manager: ALL_PERMISSIONS,
  service_advisor: ALL_PERMISSIONS,
  technician: ALL_PERMISSIONS,
  inventory_manager: ALL_PERMISSIONS,
  accountant: ALL_PERMISSIONS,
};

/** The only place permissions are checked. */
export function can(role: Role, permission: Permission): boolean {
  return PERMISSIONS_BY_ROLE[role].includes(permission);
}
