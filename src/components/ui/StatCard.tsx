import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  /** A short line under the value, e.g. "Next due 12 Oct 2026". */
  description?: ReactNode;
  /** Makes the whole card a link to the page behind the number. */
  href?: string;
  /** Extra content under the description, e.g. a usage bar. */
  children?: ReactNode;
  className?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  description,
  href,
  children,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        href &&
          "relative transition-colors focus-within:ring-2 focus-within:ring-ring hover:border-navy-200",
        className,
      )}
    >
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          {href ? (
            // The link's ::after covers the card, so the whole card is clickable with one link.
            <Link
              href={href}
              className="text-sm font-medium text-gray-500 outline-none after:absolute after:inset-0"
            >
              {label}
            </Link>
          ) : (
            <p className="text-sm font-medium text-gray-500">{label}</p>
          )}
          <span className="flex size-8 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
            <Icon aria-hidden className="size-4" />
          </span>
        </div>
        <p className="text-2xl font-semibold text-gray-900 tabular-nums">{value}</p>
        {description && <div className="text-sm text-gray-500">{description}</div>}
        {children}
      </CardContent>
    </Card>
  );
}
