import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  /** A short line under the value, e.g. "Next due 12 Oct 2026". */
  description?: ReactNode;
  /** Extra content under the description, e.g. a usage bar. */
  children?: ReactNode;
  className?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  description,
  children,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-gray-500">{label}</p>
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
