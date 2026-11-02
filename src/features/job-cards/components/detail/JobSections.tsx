import Link from "next/link";

import { DetailItem, DetailList } from "@/components/ui/DetailList";
import { NumberPlate } from "@/components/ui/NumberPlate";
import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { InspectionItem, JobCard } from "@/features/job-cards/types";
import { FUEL_LEVEL_LABELS, INSPECTION_RESULT_LABELS } from "@/features/job-cards/utils";
import { formatDateTime, formatNumber, formatPhone } from "@/lib/format";

/** A job card section, ticked once its stage is finished. */
export type SectionProps = { job: JobCard; isDone: boolean };

/** Shown in a section the job hasn't reached yet. */
export function NotYet({ children }: { children: string }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}

type VehicleCustomerSectionProps = {
  job: JobCard;
  /** The customer page is only for roles that may see customers. */
  canViewCustomer: boolean;
};

export function VehicleCustomerSection({ job, canViewCustomer }: VehicleCustomerSectionProps) {
  return (
    <SectionCard title="Vehicle and customer">
      <div className="grid gap-4 sm:grid-cols-2">
        <DetailList>
          <DetailItem label="Vehicle">
            <span className="flex flex-col items-start gap-1">
              <NumberPlate plate={job.vehicle.plate} />
              {job.vehicle.make} {job.vehicle.model}
            </span>
          </DetailItem>
        </DetailList>
        <DetailList>
          <DetailItem label="Customer">
            <span className="flex flex-col">
              {job.customer.name}
              <span className="text-gray-500">{formatPhone(job.customer.phone)}</span>
              {canViewCustomer && (
                <Link
                  href={`/garage/customers/${job.customer.id}`}
                  className="font-medium text-navy-700 hover:underline"
                >
                  Service history
                </Link>
              )}
            </span>
          </DetailItem>
        </DetailList>
      </div>
      <div className="mt-4 flex flex-col gap-1 text-sm">
        <span className="text-gray-500">Customer&apos;s complaints</span>
        <ul className="list-disc pl-5 text-gray-900">
          {job.complaints.map((complaint) => (
            <li key={complaint}>{complaint}</li>
          ))}
        </ul>
      </div>
    </SectionCard>
  );
}

export function CheckInSection({ job, isDone }: SectionProps) {
  const { checkIn } = job;
  return (
    <SectionCard title="Check-in" isDone={isDone}>
      {checkIn ? (
        <div className="flex flex-col gap-4">
          <DetailList>
            <DetailItem label="Received">
              {formatDateTime(checkIn.at)} by {checkIn.by.name}
            </DetailItem>
            <DetailItem label="Odometer">{formatNumber(checkIn.odometerKm)} km</DetailItem>
            <DetailItem label="Fuel">{FUEL_LEVEL_LABELS[checkIn.fuelLevel]}</DetailItem>
            <DetailItem label="Damage">
              {checkIn.damages.length
                ? checkIn.damages.map((damage) => `${damage.area}: ${damage.note}`).join("; ")
                : "None noted"}
            </DetailItem>
          </DetailList>
          {checkIn.photos.length > 0 && (
            <PhotoGallery photos={checkIn.photos} label="Check-in photo" />
          )}
          {checkIn.damages.flatMap((damage) => damage.photos).length > 0 && (
            <PhotoGallery
              photos={checkIn.damages.flatMap((damage) => damage.photos)}
              label="Damage photo"
            />
          )}
        </div>
      ) : (
        <NotYet>The vehicle hasn&apos;t been checked in yet.</NotYet>
      )}
    </SectionCard>
  );
}

const RESULT_STATUS = { ok: "in_stock", attention: "low_stock", replace: "out_of_stock" } as const;

function InspectionItems({ items }: { items: InspectionItem[] }) {
  return (
    <ul className="flex flex-col divide-y divide-gray-100 text-sm">
      {items.map((item) => (
        <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
          <span className="flex flex-col">
            <span className="text-gray-900">{item.name}</span>
            <span className="text-xs text-gray-500">
              {item.area}
              {item.note && ` · ${item.note}`}
            </span>
          </span>
          <StatusBadge status={RESULT_STATUS[item.result]}>
            {INSPECTION_RESULT_LABELS[item.result]}
          </StatusBadge>
        </li>
      ))}
    </ul>
  );
}

/** What needs work comes first; the items that were fine fold away. */
export function InspectionSection({ job, isDone }: SectionProps) {
  const { inspection } = job;
  const flagged = inspection?.items.filter((item) => item.result !== "ok") ?? [];
  const ok = inspection?.items.filter((item) => item.result === "ok") ?? [];
  return (
    <SectionCard title="Inspection" isDone={isDone}>
      {inspection ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-700">
            {formatDateTime(inspection.at)} by {inspection.by.name} ·{" "}
            {flagged.length
              ? `${flagged.length} of ${inspection.items.length} items need work`
              : `All ${inspection.items.length} items OK`}
          </p>
          {flagged.length > 0 && <InspectionItems items={flagged} />}
          {ok.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer py-1 font-medium text-navy-700 hover:underline">
                {ok.length} items OK
              </summary>
              <InspectionItems items={ok} />
            </details>
          )}
        </div>
      ) : (
        <NotYet>Not inspected yet.</NotYet>
      )}
    </SectionCard>
  );
}
