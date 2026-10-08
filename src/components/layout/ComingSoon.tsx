import { Construction } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

type ComingSoonProps = {
  /** What is being built, e.g. "Quick order". */
  feature: string;
};

/** Stands in for any section that isn't built yet, so no link in the app is ever dead. */
export function ComingSoon({ feature }: ComingSoonProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <EmptyState
        icon={Construction}
        title="Coming soon"
        description={`We're building ${feature}. It will be ready here shortly.`}
        action={
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        }
      />
    </div>
  );
}
