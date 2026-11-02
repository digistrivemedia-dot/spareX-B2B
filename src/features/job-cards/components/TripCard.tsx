import { ArrowRight, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { NumberPlate } from "@/components/ui/NumberPlate";
import type { JobCardSummary } from "@/features/job-cards/types";
import { formatPhone, formatWhen } from "@/lib/format";

/** One trip for the driver: where to go, who to call, and the one thing to record there. */
export function TripCard({ job }: { job: JobCardSummary }) {
  const isPickup = job.status === "out_for_pickup";
  const address = isPickup ? job.pickupDrop?.pickupAddress : job.pickupDrop?.dropAddress;

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wide text-orange-700 uppercase">
          {isPickup ? "Pick up" : "Deliver"}
          {isPickup && job.scheduledAt && ` · ${formatWhen(job.scheduledAt)}`}
        </span>
        <NumberPlate plate={job.vehicle.plate} />
        <span className="text-base font-semibold text-gray-900">
          {job.vehicle.make} {job.vehicle.model}
        </span>
      </div>
      <div className="flex flex-col gap-2 text-sm text-gray-700">
        <span className="flex items-start gap-2">
          <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-gray-500" />
          {address}
        </span>
        <a
          href={`tel:${job.customer.phone}`}
          className="flex min-h-10 items-center gap-2 font-medium text-navy-700 hover:underline"
        >
          <Phone aria-hidden className="size-4 shrink-0" />
          {job.customer.name} · {formatPhone(job.customer.phone)}
        </a>
      </div>
      <Button size="lg" asChild>
        <Link href={`/garage/jobs/${job.id}/${isPickup ? "check-in" : "handover"}`}>
          {isPickup ? "Record pick-up" : "Record delivery"}
          <ArrowRight aria-hidden />
        </Link>
      </Button>
    </li>
  );
}
