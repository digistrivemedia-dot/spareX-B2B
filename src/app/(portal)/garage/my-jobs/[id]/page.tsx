import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { NumberPlate } from "@/components/ui/NumberPlate";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FinishWorkButton } from "@/features/job-cards/components/FinishWorkButton";
import { WorkSection } from "@/features/job-cards/components/detail/WorkSections";
import { MyJobResponse } from "@/features/job-cards/components/MyJobResponse";
import { ProgressNoteForm } from "@/features/job-cards/components/ProgressNoteForm";
import { TaskChecklist } from "@/features/job-cards/components/TaskChecklist";
import { loadJobForPage } from "@/features/job-cards/load-job";
import { approvedLines } from "@/features/job-cards/utils";

export const metadata: Metadata = {
  title: "My job",
};

type MyJobPageProps = {
  params: Promise<{ id: string }>;
};

/** The technician's view of one job, built for a phone in the workshop. */
export default async function MyJobPage({ params }: MyJobPageProps) {
  const { job, session } = await loadJobForPage((await params).id, "jobs:work");
  if (job.technician?.id !== session.user.id) notFound();
  const lines = approvedLines(job.estimate?.lines ?? []);
  const isWorking = job.status === "in_progress";
  const openCount = lines.filter((line) => !line.isDone).length;

  return (
    <>
      <PageHeader title={`${job.vehicle.make} ${job.vehicle.model}`} description={job.number} />
      <div className="flex max-w-2xl flex-col gap-6">
        <SectionCard title="The vehicle" action={<StatusBadge status={job.status} />}>
          <div className="flex flex-col gap-3 text-sm">
            <NumberPlate plate={job.vehicle.plate} />
            <div>
              <p className="text-gray-500">Customer says</p>
              <ul className="list-disc pl-5 text-gray-900">
                {job.complaints.map((complaint) => (
                  <li key={complaint}>{complaint}</li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>
        {job.status === "approved" && <MyJobResponse jobId={job.id} />}
        <SectionCard title="Tasks and parts">
          {lines.length ? (
            <TaskChecklist jobId={job.id} lines={lines} isEditable={isWorking} />
          ) : (
            <p className="text-sm text-gray-500">Nothing approved yet.</p>
          )}
        </SectionCard>
        {isWorking && (
          <>
            <SectionCard title="Add an update">
              <ProgressNoteForm jobId={job.id} />
            </SectionCard>
            <FinishWorkButton jobId={job.id} openCount={openCount} />
          </>
        )}
        <WorkSection job={job} />
      </div>
    </>
  );
}
