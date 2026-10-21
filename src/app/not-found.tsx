import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <EmptyState
        icon={SearchX}
        title="We couldn't find that page"
        description="The link may be old or mistyped. Head back to your dashboard to carry on."
        action={
          <Button asChild>
            <Link href="/">Go to your home page</Link>
          </Button>
        }
      />
    </main>
  );
}
