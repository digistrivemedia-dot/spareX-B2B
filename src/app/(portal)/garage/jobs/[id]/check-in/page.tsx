import { ClipboardCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CheckInForm } from "@/features/job-cards/components/CheckInForm";
import { can } from "@/features/auth/permissions";
import { loadJobForPage } from "@/features/job-cards/load-job";

export const metadata: Metadata = {
  title: "Vehicle check-in",
};

type CheckInPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CheckInPage({ params }: CheckInPageProps) {
  // The pick-up driver records the pick-up here, at the customer's door.
  const { job, session } = await loadJobForPage((await params).id, "jobs:manage", "pickup");
  const isPickup = job.status === "out_for_pickup";
  const canCheckIn = isPickup || job.status === "confirmed" || job.status === "vehicle_received";
  const doneHref = can(session.roles, "jobs:view") ? `/garage/jobs/${job.id}` : "/garage/my-trips";

  return (
    <>
      <PageHeader
        title={isPickup ? `Pick up ${job.vehicle.plate}` : `Check in ${job.vehicle.plate}`}
        description={
          isPickup
            ? `${job.customer.name} · ${job.pickupDrop?.pickupAddress}. Note the vehicle's condition before you leave with it.`
            : `${job.vehicle.make} ${job.vehicle.model} · ${job.customer.name} · ${job.number}`
        }
      />
      {canCheckIn ? (
        <CheckInForm job={job} doneHref={doneHref} />
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
