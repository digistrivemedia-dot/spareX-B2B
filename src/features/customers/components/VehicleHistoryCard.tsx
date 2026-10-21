import Link from "next/link";

import { NumberPlate } from "@/components/ui/NumberPlate";
import { SectionCard } from "@/components/ui/SectionCard";
import { VEHICLE_TYPE_LABELS } from "@/features/catalog/utils";
import type { VehicleHistory } from "@/features/customers/types";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";

/** One vehicle's visits, newest first. Other garages' visits come without prices. */
export function VehicleHistoryCard({ vehicle }: { vehicle: VehicleHistory }) {
  return (
    <SectionCard
      title={`${vehicle.make} ${vehicle.model}`}
      action={<NumberPlate plate={vehicle.plate} />}
    >
      <p className="mb-4 text-sm text-gray-500">
        {VEHICLE_TYPE_LABELS[vehicle.type]}
        {vehicle.year && ` · ${vehicle.year}`}
      </p>
      {vehicle.visits.length ? (
        <ol className="flex flex-col divide-y divide-gray-100 text-sm">
          {vehicle.visits.map((visit) => (
            <li
              key={visit.id}
              className="flex flex-wrap justify-between gap-2 py-3 first:pt-0 last:pb-0"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-medium text-gray-900">
                  {formatDate(visit.date)} · {visit.garageName}
                </span>
                <span className="text-gray-700">{visit.summary}</span>
                {visit.odometerKm !== undefined && (
                  <span className="text-xs text-gray-500">{formatNumber(visit.odometerKm)} km</span>
                )}
              </span>
              <span className="flex flex-col items-end gap-0.5">
                {visit.jobId ? (
                  <>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {visit.totalInPaise === undefined
                        ? "No charge"
                        : formatPrice(visit.totalInPaise)}
                    </span>
                    <Link
                      href={`/garage/jobs/${visit.jobId}`}
                      className="text-xs font-medium text-navy-700 hover:underline"
                    >
                      Job card
                    </Link>
                  </>
                ) : (
                  <span className="text-xs text-gray-500">Another garage · price not shared</span>
                )}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-gray-500">No visits yet.</p>
      )}
    </SectionCard>
  );
}
