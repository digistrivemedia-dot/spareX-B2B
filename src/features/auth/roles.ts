import type { Role } from "@/features/auth/types";

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  manager: "Manager",
  service_advisor: "Service advisor",
  technician: "Technician",
  inventory_manager: "Inventory manager",
  accountant: "Accountant",
};
