import { Truck } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { requirePermission } from "@/features/auth/session";
import { getJobCards } from "@/features/job-cards/api";
import { TripCard } from "@/features/job-cards/components/TripCard";

export const metadata: Metadata = {
  title: "My trips",
};

/** Pick-ups and deliveries this person is driving now, soonest first. */
export default async function MyTripsPage() {
  const session = await requirePermission("jobs:drive", ["garage"]);
  const trips = await getJobCards({
    driverId: session.user.id,
    statuses: ["out_for_pickup", "out_for_delivery"],
    sort: "dueAt",
    order: "asc",
    pageSize: 50,
  });

  return (
    <>
      <PageHeader
        title="My trips"
        description="Vehicles you're picking up from customers or taking back to them."
      />
      {trips.items.length ? (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trips.items.map((job) => (
            <TripCard key={job.id} job={job} />
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={Truck}
            title="No trips for you"
            description="When the garage sends you to pick up or deliver a vehicle, it shows here."
          />
        </div>
      )}
    </>
  );
}
