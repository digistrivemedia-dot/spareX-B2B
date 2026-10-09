import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-gray-100 text-gray-700",
        info: "bg-info-50 text-info-700",
        success: "bg-success-50 text-success-700",
        warning: "bg-warning-50 text-warning-700",
        danger: "bg-danger-50 text-danger-700",
      },
    },
  },
);

const dotVariants = cva("size-1.5 rounded-full", {
  variants: {
    tone: {
      neutral: "bg-gray-400",
      info: "bg-info-700",
      success: "bg-success-600",
      warning: "bg-warning-500",
      danger: "bg-danger-600",
    },
  },
});

type Tone = "neutral" | "info" | "success" | "warning" | "danger";

/** Every status in the app, with its label and colour. Feature status types must be keys here. */
const STATUSES = {
  // Orders
  placed: { label: "Placed", tone: "neutral" },
  confirmed: { label: "Confirmed", tone: "info" },
  processing: { label: "Processing", tone: "info" },
  packed: { label: "Packed", tone: "info" },
  shipped: { label: "Shipped", tone: "info" },
  out_for_delivery: { label: "Out for delivery", tone: "info" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "neutral" },
  // Payments and invoices
  pending: { label: "Awaiting invoice", tone: "neutral" },
  due: { label: "Due", tone: "warning" },
  overdue: { label: "Overdue", tone: "danger" },
  paid: { label: "Paid", tone: "success" },
  // Quotations
  requested: { label: "Requested", tone: "info" },
  quoted: { label: "Awaiting you", tone: "warning" },
  accepted: { label: "Accepted", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
  expired: { label: "Expired", tone: "neutral" },
  // Stock at the delivery branch
  in_stock: { label: "In stock", tone: "success" },
  low_stock: { label: "Low stock", tone: "warning" },
  out_of_stock: { label: "Out of stock", tone: "danger" },
  // Order lines being entered (quick order, quotation requests)
  ready: { label: "Ready", tone: "success" },
  adjusted: { label: "Adjusted", tone: "warning" },
  limited_stock: { label: "Limited stock", tone: "warning" },
  not_found: { label: "Not found", tone: "danger" },
  // Company users
  active: { label: "Active", tone: "success" },
  invited: { label: "Invited", tone: "warning" },
  disabled: { label: "Disabled", tone: "neutral" },
} satisfies Record<string, { label: string; tone: Tone }>;

export type Status = keyof typeof STATUSES;

type StatusBadgeProps = {
  status: Status;
  /** Replaces the standard label while keeping the status colour, e.g. "Low · 8". */
  children?: ReactNode;
  className?: string;
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const { label, tone } = STATUSES[status];
  return (
    <span className={cn(badgeVariants({ tone }), className)}>
      <span aria-hidden className={dotVariants({ tone })} />
      {children ?? label}
    </span>
  );
}
