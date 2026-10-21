import { Link2Off } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewPasswordForm } from "@/features/auth/components/NewPasswordForm";
import { getParam, type RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Choose a new password",
};

type ResetPasswordPageProps = {
  /** `?token=` comes from the link in the reset email. */
  searchParams: Promise<RawSearchParams>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const token = getParam(await searchParams, "token");

  if (!token) {
    return (
      <EmptyState
        icon={Link2Off}
        title="This link isn't complete"
        description="Open the link from your email again, or ask for a new one."
        action={
          <Button asChild>
            <Link href="/forgot-password">Send a new link</Link>
          </Button>
        }
        className="py-4"
      />
    );
  }

  return <NewPasswordForm mode="reset" resetToken={token} />;
}
