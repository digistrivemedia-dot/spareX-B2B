import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SectionCardProps = {
  title: string;
  /** Shown at the right of the title, e.g. an edit link. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** A titled white card: one section of a form or detail page. */
export function SectionCard({ title, action, children, className }: SectionCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
