"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type PortalErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/** Keeps the sidebar and top bar on screen when a page fails. */
export default function PortalError({ retry }: PortalErrorProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <ErrorState title="This page didn't load" onRetry={retry} />
    </div>
  );
}
