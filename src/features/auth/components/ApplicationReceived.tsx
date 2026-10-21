import { CircleCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { NextSteps } from "@/features/auth/components/NextSteps";
import { ReferenceNumber } from "@/features/auth/components/ReferenceNumber";

type ApplicationReceivedProps = {
  /** Absent when someone opens the page directly rather than after submitting. */
  referenceNumber?: string;
};

export function ApplicationReceived({ referenceNumber }: ApplicationReceivedProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-success-50 text-success-700">
          <CircleCheck aria-hidden className="size-6" />
        </span>
        <h1 className="text-xl font-semibold text-gray-900">Application received</h1>
        <p className="text-sm text-gray-500">
          Our team will verify your business. Once approved, we&apos;ll email your login details.
        </p>
      </div>

      {referenceNumber && <ReferenceNumber value={referenceNumber} />}
      <NextSteps />

      <div className="flex flex-col gap-2">
        {referenceNumber && (
          <Button size="lg" asChild>
            <Link href={`/application?ref=${encodeURIComponent(referenceNumber)}`}>
              Check application status
            </Link>
          </Button>
        )}
        <Button variant="outline" size="lg" asChild>
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    </div>
  );
}
