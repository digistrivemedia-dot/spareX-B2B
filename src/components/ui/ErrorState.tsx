"use client";

import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

type ErrorStateProps = {
  /** Re-fetches and re-renders whatever failed. */
  onRetry: () => void;
  title?: string;
  className?: string;
};

/** The error state for any data area: a plain message and a retry button. */
export function ErrorState({
  onRetry,
  title = "Something went wrong",
  className,
}: ErrorStateProps) {
  return (
    <EmptyState
      tone="danger"
      icon={TriangleAlert}
      title={title}
      description="We couldn't load this. Please try again. If it keeps happening, call your Kannali account manager."
      action={<Button onClick={onRetry}>Try again</Button>}
      className={className}
    />
  );
}
