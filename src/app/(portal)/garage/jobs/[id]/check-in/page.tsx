import { ClipboardCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { scopeToBranch } from "@/features/auth/permissions";
import { requirePermission } from "@/features/auth/session";
import { getJobCard } from "@/features/job-cards/api";
import { CheckInForm } from "@/features/job-cards/components/CheckInForm";

export const metadata: Metadata = {
  title: "Vehicle check-in",
};

type CheckInPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CheckInPage({ params }: CheckInPageProps) {
  const session = await requirePermission("jobs:manage", ["garage"]);
  const job = await getJobCard((await params).id);
  const branchId = scopeToBranch(session);
  if (!job || (branchId && job.branch.id !== branchId)) notFound();
  const canCheckIn = job.status === "confirmed" || job.status === "vehicle_received";

  return (
    <>
      <PageHeader
        title={`Check in ${job.vehicle.plate}`}
        description={`${job.vehicle.make} ${job.vehicle.model} · ${job.customer.name} · ${job.number}`}
      />
      {canCheckIn ? (
        <CheckInForm job={job} />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={ClipboardCheck}
            title="Already checked in"
            description="This vehicle's arrival has been recorded. Carry on from the job card."
            action={
              <Button asChild>
                <Link href={`/garage/jobs/${job.id}`}>Open job card</Link>
              </Button>
            }
          />
        </div>
      )}
    </>
  );
}
