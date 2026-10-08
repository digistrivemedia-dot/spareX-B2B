import { CircleCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const NEXT_STEPS = [
  {
    title: "We verify your business",
    detail: "We check your GSTIN and details, usually within 1 working day.",
  },
  {
    title: "We set up your account",
    detail: "Our sales team calls to agree your business prices and credit terms.",
  },
  {
    title: "You start ordering",
    detail: "Your login details arrive by email, and you can order straight away.",
  },
];

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

      {referenceNumber && (
        <div className="rounded-lg bg-gray-50 px-4 py-3 text-center">
          <p className="text-xs text-gray-500">Reference number</p>
          <p className="text-lg font-semibold tracking-wide text-gray-900 tabular-nums">
            {referenceNumber}
          </p>
          <p className="text-xs text-gray-500">Quote this if you call us about your application.</p>
        </div>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-900">What happens next</h2>
        <ol className="flex flex-col gap-3">
          {NEXT_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-navy-700">
                {index + 1}
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-500">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Button variant="outline" size="lg" asChild>
        <Link href="/login">Back to sign in</Link>
      </Button>
    </div>
  );
}
