import { FileSearch } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getApplication } from "@/features/auth/api";
import { ApplicationStatusView } from "@/features/auth/components/ApplicationStatusView";
import { getParam, type RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Application status",
};

type ApplicationPageProps = {
  /** `?ref=` is the application's reference number. */
  searchParams: Promise<RawSearchParams>;
};

export default async function ApplicationPage({ searchParams }: ApplicationPageProps) {
  const ref = getParam(await searchParams, "ref");
  const application = ref ? await getApplication(ref) : null;

  if (!application) {
    return (
      <EmptyState
        icon={FileSearch}
        title="We couldn't find that application"
        description="Check the reference number in your email, or sign in to see your application."
        action={
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        }
        className="py-4"
      />
    );
  }

  return <ApplicationStatusView application={application} />;
}
