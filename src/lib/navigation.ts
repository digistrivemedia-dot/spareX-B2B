import {
  Building2,
  CalendarCheck,
  ClipboardList,
  Gauge,
  MapPinned,
  Store,
  FileText,
  Files,
  IndianRupee,
  LayoutDashboard,
  Package,
  PackageSearch,
  Undo2,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { can, type Permission } from "@/features/auth/permissions";
import type { Role } from "@/features/auth/types";
import type { BusinessType } from "@/features/company/types";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Only these business types see the item. Leave out to show it to everyone. */
  businessTypes?: BusinessType[];
  /** The permission a role needs to see the item. */
  permission?: Permission;
  /** Only shown to businesses Kannali has enabled credit for. */
  requiresCredit?: boolean;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

/**
 * The sidebar, in order. A new module is one entry here, e.g.
 * { label: "Job cards", href: "/garage/jobs", icon: Wrench, businessTypes: ["garage"] }
 */
export const navigation: NavSection[] = [
  {
    label: "Buying",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        permission: "catalog:view",
      },
      { label: "Catalogue", href: "/catalog", icon: PackageSearch, permission: "catalog:view" },
      { label: "Quick order", href: "/quick-order", icon: Zap, permission: "orders:place" },
      { label: "Quotations", href: "/quotations", icon: FileText, permission: "quotations:view" },
      { label: "Orders", href: "/orders", icon: Package, permission: "orders:view" },
      { label: "Returns", href: "/returns", icon: Undo2, permission: "orders:view" },
    ],
  },
  {
    label: "Garage",
    items: [
      {
        label: "Garage dashboard",
        href: "/garage",
        icon: Gauge,
        businessTypes: ["garage"],
        permission: "garage:dashboard",
      },
      {
        label: "Bookings",
        href: "/garage/bookings",
        icon: CalendarCheck,
        businessTypes: ["garage"],
        permission: "bookings:manage",
      },
      {
        label: "Job cards",
        href: "/garage/jobs",
        icon: ClipboardList,
        businessTypes: ["garage"],
        permission: "jobs:view",
      },
      {
        label: "Garage profile",
        href: "/garage/profile",
        icon: Store,
        businessTypes: ["garage"],
        permission: "garage:setup",
      },
      {
        label: "Branches",
        href: "/garage/branches",
        icon: MapPinned,
        businessTypes: ["garage"],
        permission: "garage:setup",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        label: "Credit",
        href: "/credit",
        icon: Wallet,
        permission: "credit:view",
        requiresCredit: true,
      },
      { label: "Payments", href: "/payments", icon: IndianRupee, permission: "payments:view" },
      {
        label: "Invoices & documents",
        href: "/invoices",
        icon: Files,
        permission: "documents:view",
      },
      { label: "Company", href: "/company", icon: Building2, permission: "company:view" },
    ],
  },
];

export type NavViewer = { businessType: BusinessType; roles: Role[]; creditEnabled: boolean };

/** The sections and items this business and these roles may see; empty sections are dropped. */
export function getVisibleNavigation({
  businessType,
  roles,
  creditEnabled,
}: NavViewer): NavSection[] {
  return navigation
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          (!item.businessTypes || item.businessTypes.includes(businessType)) &&
          (!item.permission || can(roles, item.permission)) &&
          (!item.requiresCredit || creditEnabled),
      ),
    }))
    .filter((section) => section.items.length > 0);
}
