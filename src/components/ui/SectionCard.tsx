import { Check } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SectionCardProps = {
  title: string;
  /** Shown at the right of the title, e.g. an edit link. */
  action?: ReactNode;
  /** Marks a finished step with a tick beside the title. */
  isDone?: boolean;
  children: ReactNode;
  className?: string;
};

/** A titled white card: one section of a form or detail page. */
export function SectionCard({ title, action, isDone, children, className }: SectionCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>{title}</CardTitle>
          {isDone && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700">
              <Check aria-hidden className="size-3.5" />
              Done
            </span>
          )}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
