import type { ReactNode } from "react";

import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Business } from "@/features/company/types";
import type { JobCard } from "@/features/job-cards/types";
import { approvedLines } from "@/features/job-cards/utils";
import { formatDate, formatDateTime, formatNumber } from "@/lib/format";

type CompletionReportProps = {
  job: JobCard;
  business: Pick<Business, "name">;
};

/** What was done to the vehicle, for the customer to keep. Prints cleanly. */
export function CompletionReport({ job, business }: CompletionReportProps) {
  const lines = approvedLines(job.estimate?.lines ?? []);
  const work = lines.filter((line) => line.kind === "labour" || line.kind === "service");
  const parts = lines.filter((line) => line.kind === "part" || line.kind === "consumable");
  const qa = job.qualityChecks.at(-1);
  const before = job.checkIn?.photos ?? [];
  const after = [...job.progress.flatMap((note) => note.photos), ...(job.handover?.photos ?? [])];

  return (
    <article className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-5 text-sm shadow-sm sm:p-8 print:border-0 print:p-0 print:shadow-none">
      <header className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-900">Service completion report</p>
          <p className="text-gray-600">
            {business.name}, {job.branch.name} · {job.number}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="font-semibold text-gray-900">{job.vehicle.plate}</p>
          <p className="text-gray-600">
            {job.vehicle.make} {job.vehicle.model} · {job.customer.name}
          </p>
        </div>
      </header>

      <dl className="grid gap-4 sm:grid-cols-3">
        <Fact label="Technician" value={job.technician?.name ?? "—"} />
        <Fact
          label="Odometer"
          value={
            job.checkIn
              ? `${formatNumber(job.checkIn.odometerKm)} km in${job.handover ? `, ${formatNumber(job.handover.odometerKm)} km out` : ""}`
              : "—"
          }
        />
        <Fact
          label="Handed over"
          value={job.handover ? formatDateTime(job.handover.at) : "Not yet"}
        />
      </dl>

      <Section title="Work done">
        <List
          items={work.map((line) => line.description)}
          empty="No labour or services on this job."
        />
      </Section>
      <Section title="Parts replaced">
        <List
          items={parts.map(
            (line) =>
              `${line.description}${line.quantity > 1 ? ` × ${line.quantity}` : ""}${line.partNumber ? ` (${line.partNumber})` : ""}`,
          )}
          empty="No parts replaced."
        />
      </Section>
      <Section title="Quality check">
        {qa ? (
          <p className="flex flex-wrap items-center gap-2 text-gray-700">
            <StatusBadge status={qa.result === "pass" ? "successful" : "failed"}>
              {qa.result === "pass" ? "Passed" : "Rework"}
            </StatusBadge>
            {qa.by.name} · {formatDateTime(qa.at)}
          </p>
        ) : (
          <p className="text-gray-500">Not checked yet.</p>
        )}
      </Section>
      {(before.length > 0 || after.length > 0) && (
        <div className="grid gap-6 sm:grid-cols-2">
          <Section title="Before">
            {before.length ? (
              <PhotoGallery photos={before} label="Before photo" />
            ) : (
              <p className="text-gray-500">No photos.</p>
            )}
          </Section>
          <Section title="After">
            {after.length ? (
              <PhotoGallery photos={after} label="After photo" />
            ) : (
              <p className="text-gray-500">No photos.</p>
            )}
          </Section>
        </div>
      )}
      <Section title="Next service due">
        <p className="text-gray-900">
          {job.nextService
            ? [
                job.nextService.date && `By ${formatDate(job.nextService.date)}`,
                job.nextService.odometerKm &&
                  `or at ${formatNumber(job.nextService.odometerKm)} km`,
              ]
                .filter(Boolean)
                .join(" ")
            : "Set when the vehicle is handed over."}
        </p>
      </Section>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

function List({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <p className="text-gray-500">{empty}</p>;
  return (
    <ul className="list-disc pl-5 text-gray-900">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
