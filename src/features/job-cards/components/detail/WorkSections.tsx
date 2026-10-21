import { DetailItem, DetailList } from "@/components/ui/DetailList";
import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EstimateLinesTable } from "@/features/job-cards/components/detail/EstimateLinesTable";
import { NotYet } from "@/features/job-cards/components/detail/JobSections";
import type { JobCard } from "@/features/job-cards/types";
import { approvedLines, sumLines } from "@/features/job-cards/utils";
import { formatDateTime, formatPrice } from "@/lib/format";

export function EstimateSection({ job }: { job: JobCard }) {
  const { estimate } = job;
  if (!estimate) {
    return (
      <SectionCard title="Estimate">
        <NotYet>No estimate yet. It is made after the inspection.</NotYet>
      </SectionCard>
    );
  }
  const approved = sumLines(approvedLines(estimate.lines));
  const hasPending = estimate.lines.some((line) => line.approval === "pending");

  return (
    <SectionCard title="Estimate">
      <div className="flex flex-col gap-4">
        <EstimateLinesTable lines={estimate.lines} />
        <dl className="ml-auto flex w-full max-w-xs flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Approved (excl. GST)</dt>
            <dd className="font-medium text-gray-900 tabular-nums">
              {formatPrice(approved.subtotalInPaise)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">GST</dt>
            <dd className="font-medium text-gray-900 tabular-nums">
              {formatPrice(approved.gstInPaise)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1">
            <dt className="font-semibold text-gray-900">Total (incl. GST)</dt>
            <dd className="font-semibold text-gray-900 tabular-nums">
              {formatPrice(approved.totalInPaise)}
            </dd>
          </div>
        </dl>
        <p className="text-xs text-gray-500">
          {hasPending
            ? "Items waiting for the customer aren't counted until they're approved."
            : estimate.decidedAt
              ? `Customer's decision recorded ${formatDateTime(estimate.decidedAt)}${estimate.approvalNote ? ` (${estimate.approvalNote.toLowerCase()})` : ""}.`
              : ""}
        </p>
      </div>
    </SectionCard>
  );
}

export function WorkSection({ job }: { job: JobCard }) {
  return (
    <SectionCard title="Technician and progress">
      <div className="flex flex-col gap-4">
        <DetailList>
          <DetailItem label="Technician">{job.technician?.name ?? "Not assigned yet"}</DetailItem>
        </DetailList>
        {job.progress.length > 0 ? (
          <ol className="flex flex-col gap-3 text-sm">
            {job.progress.map((note) => (
              <li key={note.id} className="rounded-lg bg-gray-50 p-3">
                <p className="text-gray-900">{note.text}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {note.by.name} · {formatDateTime(note.at)}
                </p>
                {note.photos.length > 0 && (
                  <div className="mt-2">
                    <PhotoGallery photos={note.photos} label="Progress photo" />
                  </div>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <NotYet>No progress updates yet.</NotYet>
        )}
      </div>
    </SectionCard>
  );
}

/** Parts and consumables on the approved estimate. Stock tracking waits for the client (B41). */
export function PartsSection({ job }: { job: JobCard }) {
  const parts = (job.estimate?.lines ?? []).filter(
    (line) => (line.kind === "part" || line.kind === "consumable") && line.approval !== "rejected",
  );
  return (
    <SectionCard title="Parts">
      {parts.length ? (
        <ul className="flex flex-col divide-y divide-gray-100 text-sm">
          {parts.map((line) => (
            <li key={line.id} className="flex justify-between gap-4 py-2 first:pt-0">
              <span className="flex flex-col">
                <span className="text-gray-900">{line.description}</span>
                {line.partNumber && (
                  <span className="text-xs text-gray-500">{line.partNumber}</span>
                )}
              </span>
              <span className="text-gray-700 tabular-nums">× {line.quantity}</span>
            </li>
          ))}
        </ul>
      ) : (
        <NotYet>No parts on this job yet.</NotYet>
      )}
    </SectionCard>
  );
}

export function QualitySection({ job }: { job: JobCard }) {
  return (
    <SectionCard title="Quality check">
      {job.qualityChecks.length ? (
        <ol className="flex flex-col gap-3 text-sm">
          {job.qualityChecks.map((check) => (
            <li key={check.at} className="flex flex-col gap-1">
              <span className="flex flex-wrap items-center gap-2">
                <StatusBadge status={check.result === "pass" ? "successful" : "failed"}>
                  {check.result === "pass" ? "Passed" : "Sent back for rework"}
                </StatusBadge>
                <span className="text-xs text-gray-500">
                  {check.by.name} · {formatDateTime(check.at)}
                </span>
              </span>
              {check.note && <span className="text-gray-700">{check.note}</span>}
            </li>
          ))}
        </ol>
      ) : (
        <NotYet>Checked before the vehicle is handed back.</NotYet>
      )}
    </SectionCard>
  );
}
