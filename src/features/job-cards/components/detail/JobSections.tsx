import Link from "next/link";

import { DetailItem, DetailList } from "@/components/ui/DetailList";
import { NumberPlate } from "@/components/ui/NumberPlate";
import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { JobCard } from "@/features/job-cards/types";
import { FUEL_LEVEL_LABELS, INSPECTION_RESULT_LABELS } from "@/features/job-cards/utils";
import { formatDateTime, formatNumber, formatPhone } from "@/lib/format";

/** Shown in a section the job hasn't reached yet. */
export function NotYet({ children }: { children: string }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}

export function VehicleCustomerSection({ job }: { job: JobCard }) {
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
              <Link
                href={`/garage/customers/${job.customer.id}`}
                className="font-medium text-navy-700 hover:underline"
              >
                Service history
              </Link>
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

export function CheckInSection({ job }: { job: JobCard }) {
  const { checkIn } = job;
  return (
    <SectionCard title="Check-in">
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

export function InspectionSection({ job }: { job: JobCard }) {
  const { inspection } = job;
  return (
    <SectionCard title="Inspection">
      {inspection ? (
        <ul className="flex flex-col divide-y divide-gray-100 text-sm">
          {inspection.items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0"
            >
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
      ) : (
        <NotYet>Not inspected yet.</NotYet>
      )}
    </SectionCard>
  );
}
