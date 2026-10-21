import { FilePlus2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DetailItem, DetailList } from "@/components/ui/DetailList";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AssignTechnicianDialog } from "@/features/job-cards/components/AssignTechnicianDialog";
import { can } from "@/features/auth/permissions";
import type { Role } from "@/features/auth/types";
import type { JobCard } from "@/features/job-cards/types";
import { getNextAction } from "@/features/job-cards/utils";
import { formatDateTime } from "@/lib/format";

/** Where the job stands, and the one thing to do next (when this person may do it). */
export function JobStatusCard({ job, roles }: { job: JobCard; roles: Role[] }) {
  const action = getNextAction(job);
  const next = action && can(roles, action.permission) ? action : undefined;
  const canManage = can(roles, "jobs:manage");
  const isWorking = job.status === "approved" || job.status === "in_progress";
  const extraWork = job.progress.findLast((note) => note.isExtraWork);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <StatusBadge status={job.status} className="self-start" />
        <DetailList>
          <DetailItem label="Branch">{job.branch.name}</DetailItem>
          <DetailItem label="Opened">
            {formatDateTime(job.createdAt)} · {job.source === "walk_in" ? "walk-in" : "booking"}
          </DetailItem>
          {job.scheduledAt && job.status === "confirmed" && (
            <DetailItem label="Due in">{formatDateTime(job.scheduledAt)}</DetailItem>
          )}
          {job.promisedAt && (
            <DetailItem label="Promised for">{formatDateTime(job.promisedAt)}</DetailItem>
          )}
          {job.technician && (
            <DetailItem label="Technician">
              {job.technician.name}
              {job.status === "approved" && " (to accept)"}
            </DetailItem>
          )}
        </DetailList>
        {extraWork && isWorking && canManage && (
          <p className="rounded-lg bg-warning-50 p-3 text-sm text-warning-700">
            {extraWork.by.name} reported extra work: {extraWork.text}
          </p>
        )}
        {next?.kind === "assign" && <AssignTechnicianDialog job={job} />}
        {next?.kind === "link" && (
          <Button size="lg" asChild>
            <Link href={next.href}>{next.label}</Link>
          </Button>
        )}
        {canManage && isWorking && (
          <div className="flex flex-col gap-2">
            {job.technician && (
              <AssignTechnicianDialog
                job={job}
                trigger={<Button variant="outline">Reassign technician</Button>}
              />
            )}
            <Button variant={extraWork ? "default" : "outline"} asChild>
              <Link href={`/garage/jobs/${job.id}/estimate/revision`}>
                <FilePlus2 aria-hidden />
                Add extra work
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
