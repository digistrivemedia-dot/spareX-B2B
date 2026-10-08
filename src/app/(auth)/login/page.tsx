import { Construction } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <EmptyState
      icon={Construction}
      title="Sign in is coming soon"
      description="You're using the demo account for now."
      action={
        <Button asChild>
          <Link href="/dashboard">Continue to dashboard</Link>
        </Button>
      }
      className="py-6"
    />
  );
}
