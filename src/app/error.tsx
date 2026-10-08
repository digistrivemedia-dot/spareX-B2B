"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ retry }: ErrorPageProps) {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <ErrorState onRetry={retry} />
    </main>
  );
}
