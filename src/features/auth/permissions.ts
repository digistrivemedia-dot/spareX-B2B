import type { Role } from "@/features/auth/types";

const ALL_PERMISSIONS = [
  "catalog:view",
  "orders:view",
  "orders:place",
  "quotations:view",
  "quotations:respond",
  "credit:view",
  "credit:pay",
  "payments:view",
  "documents:view",
  "company:view",
  "company:manage",
  "users:manage",
  "garage:setup",
  "garage:dashboard",
  "garage:all_branches",
  "bookings:manage",
  "jobs:view",
  "jobs:manage",
  "jobs:inspect",
  "jobs:work",
  "jobs:qa",
  "jobs:billing",
  "jobs:parts",
  "customers:view",
  "reviews:view",
  "reports:view",
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
  manager: [
    "garage:dashboard",
    "bookings:manage",
    "jobs:view",
    "jobs:manage",
    "jobs:inspect",
    "jobs:qa",
    "customers:view",
    "reviews:view",
  ],
  technician: ["jobs:work", "jobs:inspect"],
  spares: [...BUYING, "jobs:view", "jobs:parts"],
  billing: ["garage:dashboard", "jobs:view", "jobs:qa", "jobs:billing", "customers:view"],
};

/** The only place permissions are checked. Someone with several roles gets all of their permissions. */
export function can(roles: readonly Role[], permission: Permission): boolean {
  return roles.some((role) => PERMISSIONS_BY_ROLE[role].includes(permission));
}

/**
 * The branch a garage list shows: owners pick any branch (or all of them, when none is chosen);
 * everyone else sees only the branch they work at.
 */
export function scopeToBranch(
  { roles, branchId }: { roles: readonly Role[]; branchId: string },
  requested?: string,
): string | undefined {
  return can(roles, "garage:all_branches") ? requested : branchId;
}

/** Where someone lands after signing in, by what their roles can do. */
export function getHomePath(roles: readonly Role[]): string {
  if (can(roles, "catalog:view")) return "/dashboard";
  if (can(roles, "garage:dashboard")) return "/garage";
  if (can(roles, "jobs:work")) return "/garage/my-jobs";
  return "/garage/jobs";
}
