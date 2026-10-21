import { cva } from "class-variance-authority";
import { CircleCheck, CircleX, Clock, FilePen, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { NextSteps } from "@/features/auth/components/NextSteps";
import { ReferenceNumber } from "@/features/auth/components/ReferenceNumber";
import type { ApplicationStatus, ApprovalStatus } from "@/features/auth/types";
import { formatDateTime } from "@/lib/format";

const iconVariants = cva("flex size-12 items-center justify-center rounded-full", {
  variants: {
    tone: {
      info: "bg-info-50 text-info-700",
      warning: "bg-warning-50 text-warning-700",
      danger: "bg-danger-50 text-danger-700",
      success: "bg-success-50 text-success-700",
    },
  },
});

const STATES: Record<
  ApprovalStatus,
  { icon: LucideIcon; tone: "info" | "warning" | "danger" | "success"; title: string }
> = {
  pending: { icon: Clock, tone: "info", title: "Your application is under review" },
  sent_back: { icon: FilePen, tone: "warning", title: "Kannali needs a few changes" },
  rejected: { icon: CircleX, tone: "danger", title: "Your application wasn't approved" },
  approved: { icon: CircleCheck, tone: "success", title: "Your business is approved" },
};

/** Where an application stands and what the applicant can do next. */
export function ApplicationStatusView({ application }: { application: ApplicationStatus }) {
  const { status, referenceNumber, application: details } = application;
  const { icon: Icon, tone, title } = STATES[status];
  const ref = encodeURIComponent(referenceNumber);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className={iconVariants({ tone })}>
          <Icon aria-hidden className="size-6" />
        </span>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">
          {details.business.name} · sent {formatDateTime(application.submittedAt)}
        </p>
      </div>
      <ReferenceNumber value={referenceNumber} />

      {status === "pending" && <NextSteps />}

      {status === "sent_back" && (
        <section className="flex flex-col gap-3 rounded-lg border border-warning-500 bg-warning-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">What to change</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-gray-700">
            {application.reviewNotes?.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <Button size="lg" asChild>
            <Link href={`/register?ref=${ref}&mode=resubmit`}>Correct and resubmit</Link>
          </Button>
        </section>
      )}

      {status === "rejected" && (
        <section className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">Why</h2>
          <p className="text-sm text-gray-700">{application.rejectionReason}</p>
          <p className="text-sm text-gray-500">
            You can apply again at any time; we&apos;ll fill in your earlier details.
          </p>
          <Button size="lg" asChild>
            <Link href={`/register?ref=${ref}&mode=reapply`}>Apply again</Link>
          </Button>
        </section>
      )}

      {status === "approved" && (
        <Button size="lg" asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      )}

      {status !== "approved" && (
        <Button variant="outline" size="lg" asChild>
          <Link href="/login">Back to sign in</Link>
        </Button>
      )}
    </div>
  );
}
