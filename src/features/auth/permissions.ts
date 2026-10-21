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

const BUYING: readonly Permission[] = [
  "catalog:view",
  "orders:view",
  "orders:place",
  "quotations:view",
  "quotations:respond",
];

// The brief's starting matrix; the client is still confirming the final permissions per role.
// Narrowing or widening a role later means editing only its list here.
const PERMISSIONS_BY_ROLE: Record<Role, readonly Permission[]> = {
  owner: ALL_PERMISSIONS,
  manager: [],
  technician: [],
  spares: BUYING,
  billing: [],
};

/** The only place permissions are checked. Someone with several roles gets all of their permissions. */
export function can(roles: readonly Role[], permission: Permission): boolean {
  return roles.some((role) => PERMISSIONS_BY_ROLE[role].includes(permission));
}
