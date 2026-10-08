import { cva } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const iconVariants = cva("flex size-12 items-center justify-center rounded-full", {
  variants: {
    tone: {
      neutral: "bg-navy-50 text-navy-700",
      danger: "bg-danger-50 text-danger-700",
    },
  },
  defaultVariants: { tone: "neutral" },
});

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  /** Usually one button or link that gets the user moving again. */
  action?: ReactNode;
  /** "danger" for error states. */
  tone?: "neutral" | "danger";
  className?: string;
};

/** The empty, error and "coming soon" message used inside any card or page. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className,
      )}
    >
      <span className={iconVariants({ tone })}>
        <Icon aria-hidden className="size-6" />
      </span>
      <div className="flex max-w-sm flex-col gap-1">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
